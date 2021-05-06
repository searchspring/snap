# Icon

Renders an Icon either from our list of available icons or from a custom path. 

## Usage

### icon
The `icon` prop specifies the name of the icon to display. 

```jsx
<Icon icon='cogs' />
```


### path
The `path` prop specifies the SVG path value for custom icons.

```jsx
<Icon color='#3a23ad' size='120px' style='padding: 20px;' viewBox='0 0 70 70' path='M12.9,13.8C12.9,13.8,12.9,13.8,12.9,13.8c-0.1,0.1-0.3,0.2-0.5,0.2C4.5,17.9,1.9,28.8,6.6,38.5l28.6-13.8 c0,0,0,0,0,0c0.2-0.1,0.3-0.1,0.5-0.2C43.5,20.6,46.2,9.7,41.5,0L12.9,13.8zM8.6,42.1C8.6,42.1,8.6,42.1,8.6,42.1c-0.1,0.1-0.3,0.1-0.5,0.2C0.3,46.1-2.4,57,2.3,66.7l28.6-13.8 c0,0,0,0,0,0c0.2-0.1,0.3-0.1,0.5-0.2c7.9-3.8,10.5-14.8,5.8-24.4L8.6,42.1z' />
```

### color
The `color` prop specifies the icon color.

```jsx
<Icon icon='cogs' color="#ffff00" />
```

### size
The `size` prop specifies the custom icon size. This will be set to both the width and height.

```jsx
<Icon icon='cogs' size={'20px'} />
```

### width & height
The `width` and `height` props specify custom icon dimensions and will overwrite the `size` prop.

```jsx
<Icon icon='cogs' width={'20px'} height={'25px'} />
```

### viewBox
The `viewBox` prop specifies the SVG `viewBox` attribute. This defines the position and dimension, in user space, of an SVG viewport.

Format: `` `${min-x} ${min-y} ${width} ${height}` ``

```jsx
<Icon icon='cogs' viewBox={'0 0 20 20'} />
```
