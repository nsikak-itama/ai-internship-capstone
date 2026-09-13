# shadcn/ui Comparison Notes

## Modal Dialog

My custom `ModalDialog` implementation manually handles several accessibility-critical behaviors:

- Moving focus into the dialog when it opens.
- Trapping `Tab` and `Shift+Tab` within the dialog.
- Closing the dialog when `Escape` is pressed.
- Returning focus to the trigger after the dialog closes.
- Providing `role="dialog"`, `aria-modal="true"`, and an accessible title relationship.

The shadcn Dialog component delegates these interaction behaviors to the underlying Radix Dialog primitive. The generated `dialog.tsx` does not need its own document-level keyboard listener, focusable-element query, or focus-trapping logic.

Another difference is the component API. My version accepts a `title` prop and `children`, while shadcn provides separate primitives such as `DialogTitle`, `DialogDescription`, `DialogTrigger`, and `DialogClose`. This gives the underlying primitive a more composable semantic structure.

## Tabs

My custom `Tabs` implementation manually handles:

- Left and Right Arrow keyboard navigation.
- Wrapping from the first tab to the last and vice versa.
- Moving focus to the newly selected tab.
- Roving `tabIndex` between tabs.
- Automatic activation when an arrow key changes the selected tab.

The shadcn Tabs component delegates the tab interaction behavior to the underlying Radix Tabs primitive. The generated wrapper therefore does not need to implement its own keyboard event handler or focus-management logic.

My version also assumes a horizontal tablist. The shadcn wrapper exposes an `orientation` prop and passes it to the underlying Tabs primitive, allowing the component to support horizontal and vertical orientations.

## Overall Comparison

The custom components successfully implement the required keyboard interactions for this assignment, including focus management for the modal. The main difference is where the accessibility behavior lives.

My components contain the accessibility interaction logic directly. shadcn's generated components are thin wrappers around reusable Radix primitives, which encapsulate much of the keyboard, focus, and ARIA behavior.

This reduces the amount of accessibility-critical behavior that application code has to implement and maintain, while also providing more composable component APIs.
