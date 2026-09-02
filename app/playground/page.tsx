import Disclosure from "../../playground/Disclosure";

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
    </main>
  );
}