# Image

Renders an Image with fallback and rollover functionality. 

## Usage

### src
The required `src` prop specifies the URL of the image to render.

```jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' />
```

### alt
The required `alt` prop is the image `alt` attribute.

```jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' />
```

### fallback
The `fallback` prop specifies the URL of the fallback image to render if the primary image fails to load.

```jsx
<Image src={searchResponse.results.mappings.core.imageUrl} fallback='https://www.example.com/image.jpg' alt='image' />
```

### hoverSrc
The `hoverSrc` prop specifiesthe URL of the alternative image to display on hover.

```jsx
<Image src={searchResponse.results.mappings.core.imageUrl} hoverSrc={searchResponse.results.mappings.core.hoverImg} alt='image' />
```


### lazy
The `lazy` prop is used to disable the lazy loading feature. Enabled by default. 

```jsx
<Image src={searchResponse.results.mappings.core.imageUrl} lazy={false} alt='image' />
```

### Events

#### onMouseOver
The `onMouseOver` prop allows for a custom callback function when the mouse cursor enters the image.

```jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' onMouseOver={(e)=>{console.log(e)}} />
```

#### onMouseOut
The `onMouseOut` prop allows for a custom callback function when the mouse cursor leaves the image.

```jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' onMouseOut={(e)=>{console.log(e)}} />
```

#### onError
The `onError` prop allows for a custom callback function when the image has encountered an error.

```jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' onError={(e)=>{console.log(e)}} />
```

#### onLoad
The `onLoad` prop allows for a custom callback function when the image has finished loading.

```jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' onLoad={(e)=>{console.log(e)}} />
```

#### onClick
The `onClick` prop allows for a custom callback function when the image is clicked. 

```jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' onClick={(e)=>{console.log(e)}} />
```
