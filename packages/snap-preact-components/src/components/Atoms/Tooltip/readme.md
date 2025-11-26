# Tooltip

The `Tooltip` component displays a text label when the user hovers over an element.

## Usage

### Basic Usage

```jsx
<Tooltip content="This is a tooltip">
  <span>Hover me</span>
</Tooltip>
```

### With Icon

```jsx
<Tooltip content="This is a tooltip" icon="info" />
```

### With Portal

The `usePortal` prop will render the tooltip within a portal. This places the tooltip directly on the document body and automatically repositions it, helping to resolve z-index and overflow problems.

```jsx
<Tooltip content="This is a tooltip" usePortal>
  <span>Hover me</span>
</Tooltip>
```
