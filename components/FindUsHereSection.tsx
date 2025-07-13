import { Home, Mail, Phone } from "lucide-react";

const contactList = [
  {
    icon: <Phone className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
    title: "Phone",
    detail: "+92 302 0620626",
  },
  {
    icon: <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
    title: "Email",
    detail: "tahsin3194@gmail.com",
  },
  {
    icon: <Home className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
    title: "Location",
    detail: "University of Sahiwal, Punjab",
  },
];

export default function FindUsHereSection() {
  return (
    <section className="flex flex-col px-4 sm:px-6 py-10 sm:py-20 gap-10 max-w-screen-xl mx-auto">
      {/* Section Title */}
      <h2 className="font-bold text-3xl sm:text-4xl text-foreground tracking-tight">
        Find Us Here
      </h2>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contactList.map((ele) => (
          <div
            key={ele.title}
            className="flex items-center gap-5 p-6 bg-light-4 dark:bg-dark-4 rounded-2xl shadow-md transition hover:shadow-lg"
          >
            <div className="flex-shrink-0">{ele.icon}</div>
            <div>
              <h5 className="text-lg font-semibold text-white dark:text-white">
                {ele.title}
              </h5>
              <p className="text-sm text-gray-200 dark:text-muted-foreground">
                {ele.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Map */}
      <div className="w-full overflow-hidden rounded-3xl shadow-md border border-border">
        <iframe
          title="Google Maps Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3431.3123217833536!2d73.08693937610249!3d30.68148748810657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3922b7fc5f65c751%3A0xb5f17e730625a55!2zVW5pdmVyc2l0eSBvZiBTYWhpd2FsINis2KfZhdi524Eg2LPYp9uB24zZiNin2YQ!5e0!3m2!1sen!2s!4v1748087085023!5m2!1sen!2s"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-[350px] sm:h-[450px] lg:h-[500px]"
          style={{ border: 0 }}
        />
      </div>
    </section>
  );
}
