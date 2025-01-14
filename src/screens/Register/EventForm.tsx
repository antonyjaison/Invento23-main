import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { EventType, eventTypes } from '../../api/schema'
import { Accordion } from '../../components/Accordion'
import { ItemCard } from '../../components/Card/Card'
import { ItemGroup } from '../../components/ItemGroup'
import { titleMap } from '../../constants'
import useEventsQuery from '../../hooks/useEventsQuery'
import { useStore } from '../../store'

const eventSubCategories: Record<
    EventType['eventType'] | string,
    EventType['category'][] | string[]
> = {
    // proshow: ['Day 1', 'Day 2', 'Day 3', 'Day 4'],
    techfest: ['workshops', 'competitions', 'exhibitions', 'preevents', 'generalevents'],
    saptha: ['spotlight', 'group', 'solo', 'generalevents'],
    // taksthi: [],
}

export function EventForm() {
    const {
        addItem,
        removeItem,
        items: bucket,
        setUpdatedPrice,
        setMembers: setMembersForItem,
    } = useStore((state) => state)
    const [, setSelectedKey] = useState<string[]>([])
    const [selectedAccordian, setAccordian] = useState('')
    const navigate = useNavigate()
    // const setGroups = useContext(GroupDispatchContext)

    // const groupsFromContext = useContext(GroupContext)

    // const [members, setMembers] = useState<string[]>([])

    const events = useEventsQuery()

    if (events.isLoading) toast('Loading events...', { type: 'info', toastId: 'fefe' })

    useEffect(() => {
        if (events.error) {
            toast.error('Error fetching events', { toastId: 'fefefe' })
            navigate('/status?state=error')
        }
    }, [events.error])

    const renderSubTypeEvents = (
        eventType: EventType['eventType'] | string,
        subType: EventType['category'] | string,
    ) => {
        if (events?.data?.success) {
            const eventsOfTypeAndSubType = events.data?.events.filter((event) => {
                return event.eventType === eventType && event.category === subType
            })

            return eventsOfTypeAndSubType?.map((event) => {
                const group: boolean =
                    event.regFeeTeam &&
                    event.maxParticipants &&
                    event?.maxParticipants > 0
                        ? true
                        : false
                return (
                    event.isAvailable && (
                        <ItemCard
                            selected={bucket.some((e) => e._id === event._id)}
                            itemId={event._id}
                            onClick={() =>
                                setSelectedKey((state) => [...state, event._id])
                            }
                            title={event.name}
                            date={event.date}
                            fee={event.regFee || event.regFeeTeam || 0}
                            image={event.photo?.secure_url || '/static/natya.jpg'}
                            imgId={event.photo?.id || ''}
                            key={event._id}
                            group={group}
                            maxParticipants={event.maxParticipants || 0}
                            actionType="togglable"
                            calcPriceMode={
                                event?.name?.toLowerCase() === 'natya' ||
                                event?.name?.toLowerCase() === 'taksati'
                                    ? 'calcOnInput'
                                    : 'normal'
                            }
                            onGroupFormSubmit={(data) => {
                                const gmembers = Object.entries(data).map(
                                    ([, value]) => value,
                                )
                                // addMembers(itemId, members)
                                if (group) {
                                    // setMembers(members)
                                    setMembersForItem(event._id, gmembers)
                                    if (
                                        event?.name?.toLowerCase() === 'natya' ||
                                        event?.name?.toLowerCase() === 'taksati'
                                    ) {
                                        const calculatedPrice =
                                            (event.regFeeTeam ?? 0) *
                                            gmembers.filter((e) => e !== '').length
                                        setUpdatedPrice(event._id, calculatedPrice)
                                    }
                                }
                            }}
                            calcPrice={() =>
                                bucket.find((e) => e._id === event._id)?.updatedPrice ?? 0
                            }
                            actions={[
                                () => {
                                    addItem({
                                        _id: event._id,
                                        name: event.name,
                                        regFee: event.regFee || event.regFeeTeam,
                                        basePrice: event.regFee || event.regFeeTeam,
                                        date: event.date,
                                        // photo: event.photo?.secure_url || '/static/natya.jpg',
                                        image:
                                            event.photo?.secure_url ||
                                            '/static/natya.jpg',
                                        imageId: event.photo?.id || '',
                                        participationType: group ? 'group' : 'solo',
                                        // members: group ? groups[event._id] : [],
                                        members: [],
                                    })
                                },
                                () => {
                                    removeItem(event._id)
                                    setSelectedKey((state) =>
                                        state.filter((key) => key !== event._id),
                                    )
                                },
                            ]}
                        />
                    )
                )
            })
        }
    }

    return (
        <>
            <div className="">
                <h3 className="text-black ff-serif fw-400">Select your events</h3>
            </div>
            <div className="form__eventsWrap bg-white flow grid">
                {/* <div className="proShowWrap">
                    <ItemGroup title="Pro show">
                        <Accordion title="Pro Show"></Accordion>
                    </ItemGroup>
                </div> */}
                {eventTypes.map(
                    (eventType) =>
                        eventType !== 'proshow' &&
                        eventType !== 'taksthi' && (
                            <div key={eventType} className="proShowWrap">
                                <ItemGroup title={titleMap[eventType]}>
                                    {eventSubCategories[eventType].map((subType) => (
                                        <Accordion
                                            selectedAccordian={selectedAccordian}
                                            setAccordian={setAccordian}
                                            title={
                                                titleMap[
                                                    subType as keyof typeof titleMap
                                                ] || subType
                                            }
                                            key={subType}
                                        >
                                            <div className="itemCardWrap">
                                                {renderSubTypeEvents(eventType, subType)}
                                            </div>
                                        </Accordion>
                                    ))}
                                </ItemGroup>
                            </div>
                        ),
                )}
                {/* <button className="btn btn--save text-white ff-serif">
                    Save Changes
                </button> */}
            </div>
        </>
    )
}
