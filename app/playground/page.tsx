import Disclosure from "../../playground/Disclosure";
import Tabs from "../../playground/Tabs";

export default function PlaygroundPage() {
  return (
    <main>
      <h1>Accessible Component Playground</h1>

      <section>
        <h2>Disclosure</h2>

        <Disclosure title="What is accessibility?">
          <p>
            Accessibility means designing websites and applications so that
            people with different abilities can use them effectively.
          </p>
        </Disclosure>
      </section>

      <section>
        <h2>Tabs</h2>
        <Tabs tabs={[
            {
              id: "tab-overview",
              label: "Overview",
              content: <p>This is the overview panel.</p>,
            },
            {
              id: "tab-features",
              label: "Features",
              content: <p>This is the features panel.</p>,
            },
            {
              id: "tab-details",
              label: "Details",
              content: <p>This is the details panel.</p>,
            }, 
        ]}>

        </Tabs>
      </section>
    </main>
  );
}