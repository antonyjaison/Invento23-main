import { AdvancedImage, lazyload, placeholder } from '@cloudinary/react'
import { HTMLMotionProps, m } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { cld } from '../../App'
import { isSmall } from '../../hooks'
import { useStore } from '../../store'
// import { useMediaQuery } from '../../hooks'
import { transformDate } from '../../utils'
import { ToggleButton } from '../Button'
import { FormInput } from '../Form'
import { ImgWithFallback } from '../ImgWithFallback'
interface ICardProps extends HTMLMotionProps<'div'> {
    bgUrl: string
    title: string
    imgId?: string
}

// const parentVariants: Variants = {
//     rest: {
//         transition: {
//             duration: 2,
//             type: 'tween',
//             ease: 'easeIn',
//         },
//     },
//     hover: {
//         transition: {
//             duration: 0.4,
//             type: 'tween',
//             ease: 'easeOut',
//         },
//     },
// }

// const textVariants: Variants = {
//     rest: {
//         opacity: 0,
//         y: '-50%',
//     },
//     hover: {
//         opacity: 1,
//         y: '0%',
//     },
// }

// const touchTextVariants: Variants = {
//     rest: {
//         opacity: 1,
//         y: '0%',
//     },
// }

export default function Card({ bgUrl, title, imgId, ...rest }: ICardProps) {
    // Fix this not working
    // const isMobile = useMediaQuery('(min-width: 48em)')
    //debugger
    return (
        <m.div
            {...rest}
            className="event-card"
            whileHover="hover"
            initial="rest"
            animate="rest"
        >
            <m.div
                className="event-card-img"
                // variants={!isMobile ? parentVariants : undefined}
            >
                {/* <ImgWithFallback src={bgUrl} imgDescription="card-placeholder" />
                 */}
                {imgId ? (
                    <AdvancedImage
                        cldImg={cld.image(imgId).format('auto').quality('auto')}
                        plugins={[
                            lazyload(),
                            placeholder({
                                mode: 'blur',
                            }),
                        ]}
                    />
                ) : (
                    <ImgWithFallback src={bgUrl} imgDescription="card-placeholder" />
                )}
            </m.div>
            <m.div
                className="event-card-title"
                // variants={!isMobile ? textVariants : touchTextVariants}
            >
                <p className="ff-days-one fw-300 text-white uppercase">{title}</p>
            </m.div>
        </m.div>
    )
}

type ItemCardPropsBase = {
    imgId?: string
    image: string
    title: string
    date: string
    fee: number
    selected: boolean
    itemId: string
    onClick: () => void
    mode?: 'collect' | 'show'
    renderPriceSlot?: () => JSX.Element
}

type TogglableAction = {
    actionType: 'togglable'
    actions: [() => void, () => void]
}

type NonTogglableAction = {
    actionType: 'nonTogglable'
    action: () => void
}

type GroupItem = {
    group: true
    maxParticipants: number
    onGroupFormSubmit?: (data: { [key: string]: string }) => void
    calcPriceMode?: 'normal' | 'calcOnInput'
    calcPrice?: () => number
}

type IndividualItem = {
    group: false
}

type ItemCardProps = ItemCardPropsBase &
    (TogglableAction | NonTogglableAction) &
    (GroupItem | IndividualItem)

export function ItemCard({
    imgId,
    itemId,
    image,
    title,
    date,
    fee,
    mode = 'collect',
    ...props
}: ItemCardProps) {
    // const { groups } = useGroupStore((state) => state)
    const { items } = useStore((state) => state)
    const [loading] = useState(false)

    const [calculatedPrice, setCalculatedPrice] = useState(() => {
        if (props.group && props.calcPriceMode === 'calcOnInput') {
            return props.calcPrice ? props.calcPrice() : 0
        }
        return fee
    })

    useEffect(() => {
        if (props.group && props.calcPriceMode === 'calcOnInput') {
            setCalculatedPrice(props.calcPrice ? props.calcPrice() : 0)
        }
    }, [props])

    const isSmallScreen = isSmall()

    const [defaultValue] = useState(() => {
        // const defaultValues = groups?.[itemId]?.reduce((acc, val) => {
        //     const key = Object.keys(val)[0]
        //     return {
        //         ...acc,
        //         [key]: val[key],
        //     }
        // }, {})
        // return defaultValues || {}

        const defaultValues = items
            .find((e) => e._id === itemId)
            ?.members?.reduce((acc, cur, index) => {
                return {
                    ...acc,
                    [`member-${index + 1}`]: cur,
                }
            }, {})
        return defaultValues || {}
    })
    const { register, handleSubmit } = useForm<{
        [key: string]: string
    }>({
        defaultValues: defaultValue,
    })

    const isGroup = props.group && props.maxParticipants > 0

    return (
        <div className="itemCard">
            <div
                className={`itemCard_details grid ${
                    isGroup && 'itemCard_details--group'
                }`}
            >
                <div className="wrap-img flex">
                    {imgId ? (
                        <AdvancedImage
                            cldImg={cld.image(imgId).format('auto').quality('auto')}
                        />
                    ) : (
                        <img src={`${image}`} alt={`${title}`} />
                    )}
                </div>

                <Link to={`/events/${itemId}`}>
                    <h3 className="text-black underline ff-serif fw-400">{title}</h3>
                </Link>
                <p className="ff-serif text-black fw-400 detail-fee">
                    {props.renderPriceSlot
                        ? props.renderPriceSlot()
                        : props.group && props.calcPriceMode === 'calcOnInput'
                        ? `Registration Fee: \u20b9${fee} per person`
                        : `Registration Fee: \u20b9${fee}`}
                    {/* {props?.renderPriceSlot ? props.renderPriceSlot() : ''}
                    {props.group &&
                    !props.renderPriceSlot &&
                    props.calcPriceMode === 'normal'
                        ? fee
                        // rupee in unicode:  
                        : `${fee} per person`} */}
                </p>
                <p className="ff-serif text-black fw-400 detail-date">
                    {' '}
                    Date: {transformDate(date)}
                </p>
                {mode === 'collect' && !isGroup ? (
                    <ToggleButton
                        selected={props.selected}
                        toggle={props.onClick}
                        actionTrue={
                            props.actionType === 'togglable'
                                ? props.actions[0]
                                : props.action
                        }
                        actionFalse={
                            props.actionType === 'togglable'
                                ? props.actions[1]
                                : props.action
                        }
                        isLoading={loading}
                    />
                ) : (
                    <div
                        className="wrap-icon-group"
                        style={{
                            display:
                                mode === 'show' || isSmallScreen ? 'none' : 'initial',
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="icon-group"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                            />
                        </svg>
                    </div>
                )}
                {mode === 'show' && (
                    <ToggleButton
                        selected={props.selected}
                        toggle={props.onClick}
                        actionTrue={
                            props.actionType === 'togglable'
                                ? props.actions[0]
                                : props.action
                        }
                        actionFalse={
                            props.actionType === 'togglable'
                                ? props.actions[1]
                                : props.action
                        }
                        isLoading={loading}
                    />
                )}
            </div>
            {mode === 'collect' && isGroup && (
                <>
                    <p className="text-black ff-serif mt-sm">
                        You are eligible to register up to {props.maxParticipants} team
                        members for this event. <br />
                        Kindly provide the names of your team members in the designated
                        fields below.
                    </p>

                    <form className="itemCard_group grid mt-sm text-black ff-serif fw-400">
                        {Array.from({ length: props.maxParticipants }).map((_, i) => (
                            <FormInput
                                key={itemId + i}
                                kind="input"
                                inputType="text"
                                label={`Enter Team Member ${i + 1}`}
                                register={register}
                                forEl={`member-${i + 1}`}
                                placeholder='e.g. "John Doe"'
                            />
                        ))}
                        <ToggleButton
                            selected={props.selected}
                            // submit
                            toggle={props.onClick}
                            actionTrue={
                                props.actionType === 'togglable'
                                    ? () => {
                                          props.actions[0]()
                                          handleSubmit(
                                              props.onGroupFormSubmit
                                                  ? props.onGroupFormSubmit
                                                  : // eslint-disable-next-line @typescript-eslint/no-empty-function
                                                    () => {},
                                              //   onInvalid,
                                          )()

                                          //   setTimeout(() => {
                                          //   }, 500)
                                      }
                                    : //   props.actions[0]
                                      props.action
                            }
                            actionFalse={
                                props.actionType === 'togglable'
                                    ? props.actions[1]
                                    : props.action
                            }
                            // isLoading={loading}
                            showText
                        />
                        {props.calcPriceMode === 'calcOnInput' && (
                            <p className="text-black ff-serif fw-400 mt-sm">
                                Total Registration Fee: {calculatedPrice}
                            </p>
                        )}
                    </form>
                </>
            )}
        </div>
    )
}
