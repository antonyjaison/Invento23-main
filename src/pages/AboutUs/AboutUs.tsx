import { ProfileCard } from '../../components/Card'

export function AboutUs() {
    return (
        <div className="wrap-aboutUs mh-full pt-m-4-6">
            <section className="aboutUs">
                <h3 className="ff-serif fw-500 text-white striked-heading">The team</h3>
                <p className="text-white ff-serif fw-400">
                    Meet our team of creators, designers, and world-class problem solvers
                </p>

                <div className="cards grid">
                    <ProfileCard
                        designation="Head of ops"
                        imageUrl="/static/card_placeholder.jpg"
                        name="John Doe"
                    />

                    <ProfileCard
                        designation="Head of ops"
                        imageUrl="/static/card_placeholder.jpg"
                        name="John Doe"
                    />
                    <ProfileCard
                        designation="Head of ops"
                        imageUrl="/static/card_placeholder.jpg"
                        name="John Doe"
                    />
                    <ProfileCard
                        designation="Head of ops"
                        imageUrl="/static/card_placeholder.jpg"
                        name="John Doe"
                    />
                    <ProfileCard
                        designation="Head of ops"
                        imageUrl="/static/card_placeholder.jpg"
                        name="John Doe"
                    />
                    <ProfileCard
                        designation="Head of ops"
                        imageUrl="/static/card_placeholder.jpg"
                        name="John Doe"
                    />
                    <ProfileCard
                        designation="Head of ops"
                        imageUrl="/static/card_placeholder.jpg"
                        name="John Doe"
                    />
                    <ProfileCard
                        designation="Head of ops"
                        imageUrl="/static/card_placeholder.jpg"
                        name="John Doe"
                    />
                    <ProfileCard
                        designation="Head of ops"
                        imageUrl="/static/card_placeholder.jpg"
                        name="John Doe"
                    />
                    <ProfileCard
                        designation="Head of ops"
                        imageUrl="/static/card_placeholder.jpg"
                        name="John Doe"
                    />
                </div>
            </section>
        </div>
    )
}
