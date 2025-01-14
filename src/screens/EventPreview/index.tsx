import { AdvancedImage, lazyload, placeholder } from '@cloudinary/react'
import { useRef } from 'react'
import { ScrollRestoration, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { cld } from '../../App'
import Button from '../../components/Button'
import { ImgWithFallback } from '../../components/ImgWithFallback'
import Loading from '../../components/Loading'
import { isSmall } from '../../hooks'
import useEventQuery from '../../hooks/useEventQuery'
import { transformDate, transformTime } from '../../utils'
import { NotFound } from '../NotFound'

// function ScrollToTopOnMount() {
//     useEffect(() => {
//         window.scrollTo(0, 0)
//     }, [])

//     return null
// }

export default function EventPreview() {
    const ref = useRef<HTMLDivElement>(null)
    const isMobile = isSmall()

    const { id = '232' } = useParams<{ id: string }>()

    const event = useEventQuery(id)

    if (event.isLoading) return <Loading />

    if (event.error || !event.data?.success) {
        toast.error('Error Loading Event', {
            toastId: 'dwqsdx',
        })

        return <NotFound />
    }

    const {
        name,
        date,
        time,
        description,
        rules,
        prize,
        isOnline,
        department,
        contactNameFirst,
        contactNameSecond,
        contactNumberFirst,
        contactNumberSecond,
        category,
        regFee,
        regFeeTeam,
        isAvailable,
    } = event.data.event

    const { id: imgId } = event.data.event.photo || {}
    const { id: imgIdMobile } = event.data.event.photoMobile || {}

    let imgIdToUse = imgId
    if (isMobile && imgIdMobile) imgIdToUse = imgIdMobile

    const eventRules = rules?.map((rule, i) => <li key={`${i}-${id}`}>{rule}</li>)

    const contactAvailable = contactNameFirst || contactNumberFirst

    return (
        <>
            {/* <ScrollToTopOnMount /> */}
            <ScrollRestoration />
            <section className="eventPreview pt-m-4-6">
                <div className="bg__container grid">
                    <div className="preview-background" ref={ref} aria-hidden>
                        {/* <ImgWithFallback src={secure_url} imgDescription="" /> */}
                        {imgIdToUse ? (
                            <AdvancedImage
                                style={{
                                    maxWidth: '100%',
                                }}
                                cldImg={cld
                                    .image(imgIdToUse)
                                    .format('auto')
                                    .quality('auto')}
                                plugins={[
                                    lazyload(),
                                    // responsive({
                                    //     steps: [680, 900, 1150, 1500],
                                    // }),
                                    placeholder({
                                        mode: 'vectorize',
                                    }),
                                ]}
                            />
                        ) : (
                            <ImgWithFallback
                                src="/static/natya_large.jpg"
                                imgDescription=""
                            />
                        )}
                        {/* <ImgWithFallback
                            // src="/static/natya_large.jpg"
                            src={
                                event.data.event.photo?.secure_url ||
                                '/static/natya_large.jpg'
                            }
                            imgDescription=""
                        /> */}
                    </div>

                    {/* {!(eventType === 'techfest') && (
                        <p className="eventPreview__title ff-days-one fw-400 text-white uppercase ">
                            {name}
                        </p>
                    )} */}
                </div>
                <div className="eventPreview__content panel--bg mh-full grid">
                    <div className="eventPreview__about text-white ff-serif centeredContainer side-padding flow">
                        <h4 className="fw-500 fs-650">About {name}</h4>
                        <p className="eventPreview__description">{description}</p>
                        <div className="flow fw-500 event-preview-details">
                            <span className="d-b">Date: {transformDate(date)}</span>
                            {time && (
                                <span className="d-b">Time: {transformTime(time)}</span>
                            )}
                            {category !== 'workshops' && (
                                <span className="d-b">
                                    Prizes worth: {prize ? prize : 'TBA'}
                                </span>
                            )}
                            <span className="d-b">
                                Mode: {isOnline ? 'Online' : 'Offline'}
                            </span>
                            {department && (
                                <span className="d-b">
                                    Hosted by: {department} department
                                </span>
                            )}
                            {regFeeTeam && (
                                <span className="d-b">
                                    Registration Fee:
                                    {` ${regFeeTeam} per team`}
                                </span>
                            )}
                            {regFee && (
                                <span className="d-b">Registration Fee: {regFee}</span>
                            )}
                            {contactAvailable && (
                                <span className="d-b">
                                    <h5 className="ff-days-one">Contacts: </h5>
                                    <div className="flow contact-wrap">
                                        {contactNameFirst && contactNumberFirst && (
                                            <span className="d-b">
                                                {contactNameFirst} - {''}
                                                <a
                                                    className="text-white text-decoration-none"
                                                    href={`tel:${contactNumberFirst}`}
                                                >
                                                    {contactNumberFirst}
                                                </a>
                                            </span>
                                        )}
                                        {contactNameSecond && contactNumberSecond && (
                                            <span className="d-b">
                                                {contactNameSecond} - {''}
                                                <a
                                                    className="text-white text-decoration-none"
                                                    href={`tel:${contactNumberSecond}`}
                                                >
                                                    {contactNumberSecond}
                                                </a>
                                            </span>
                                        )}
                                    </div>
                                </span>
                            )}
                            {isAvailable ? (
                                <Button
                                    type="internalUrl"
                                    to={`/register/${id}`}
                                    classNames={`text-magenta btn d-ib btn--link btn--register_event gradient-borders`}
                                >
                                    register now
                                </Button>
                            ) : (
                                <p className="mt-sm text-red uppercase text-reg-closed">
                                    Registrations are closed for this event.
                                </p>
                            )}
                        </div>
                    </div>
                    {eventRules.length > 0 && (
                        <div className="eventPreview__rules text-white ff-serif centeredContainer side-padding">
                            <h4 className="fs-650 fw-500">Rules and Regulations</h4>
                            <ul className="flow">{eventRules}</ul>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
