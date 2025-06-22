import { Home, Mail, Phone } from "lucide-react";

const contactList = [
  {
    icon: <Phone className="w-10 h-10 sm:w-16 sm:h-16"/>,
    title: "Phone",
    detail: "+92 302 0620626",
  },
  {
    icon: <Mail className="w-10 h-10 sm:w-16 sm:h-16"/>,
    title: "Email",
    detail: "tahsin3194@gmail.com",
  },
  {
    icon: <Home className="w-10 h-10 sm:w-16 sm:h-16"/>,
    title: "Location",
    detail: "University of Sahiwal, Punjab",
  },
];

export default function FindUsHereSection() {
  return (
    <section className="flex flex-col px-2 sm:px-6 py-10 sm:py-20 gap-10">
      <h2 className="font-ubuntu font-bold text-2xl sm:text-4xl -tracking-[0.5px]">
        Find Us Here
      </h2>
      {/* Contacts */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-12 text-white">
        {contactList.map((ele) => (
          <div
            key={ele.title}
            className="w-full h-[60px] sm:h-[120px] lg:w-1/3 bg-light-4 dark:bg-dark-4 flex items-center p-6 gap-4 rounded-[15px] shadow-light dark:shadow-dark "
          >
            <div>{ele.icon}</div>
            <div>
              <h5 className="font-bold text-[18px]">{ele.title}</h5>
              <p className="text-gray-200 text-base">{ele.detail}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Map */}
      <div className="w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3431.3123217833536!2d73.08693937610249!3d30.68148748810657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3922b7fc5f65c751%3A0xb5f17e730625a55!2zVW5pdmVyc2l0eSBvZiBTYWhpd2FsINis2KfZhdi524Eg2LPYp9uB24zZiNin2YQ!5e0!3m2!1sen!2s!4v1748087085023!5m2!1sen!2s"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0, }}
          className="w-full h-[600px] lg:h-96 rounded-4xl shadow-light dark:shadow-dark"
          title="Google Maps Location"
        />
      </div>
    </section>
  );
}
