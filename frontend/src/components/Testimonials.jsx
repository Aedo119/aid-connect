function TestCard({ quote, name, role, avatar }) {
  return (
    <div className="card p-6">
      <p className="text-gray-700">“{quote}”</p>
      <div className="mt-4 flex items-center gap-3">
        <img alt={name} src={avatar} className="h-10 w-10 rounded-full object-cover"/>
        <div>
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs text-gray-500">{role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-2xl font-extrabold">What People Say</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-gray-600">
          Hear from our community of donors and organizations
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <TestCard
            quote="AidConnect makes it so easy to find and support causes I care about. I love seeing the direct impact of my donations."
            name="Sarah Johnson"
            role="Regular Donor"
            avatar="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop"
          />
          <TestCard
            quote="The platform has revolutionized how we connect with donors. Our campaigns reach more people than ever before."
            name="Michael Chen"
            role="NGO Director"
            avatar="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop"
          />
          <TestCard
            quote="I appreciate the transparency and trust that AidConnect brings to charitable giving. Every donation counts."
            name="Emily Rodriguez"
            role="Community Volunteer"
            avatar="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=256&auto=format&fit=crop"
          />
        </div>
      </div>
    </section>
  );
}
