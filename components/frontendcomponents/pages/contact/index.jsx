import ContactDetail from "./Detail";
import Form from "./Form";
import Map from "./Map";

const Contact = () => {
  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <ContactDetail />
        <Form />
      </section>
      <Map />
    </>
  );
};

export default Contact;
