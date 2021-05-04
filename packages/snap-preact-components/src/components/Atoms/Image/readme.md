## Image

Renders an Image with fallback and rollover functionality. 

## Usage

### src
The required `src` prop contains the url of the image to render.

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' />
```

### alt
The required `alt` prop is the image `alt` attribute

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' />
```

### fallback
The `fallback` prop contains the url of the fallback image to render if the primary image fails to load.

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} fallback='https://www.example.com/image.jpg' alt='image' />
```

### hoverSrc
The `hoverSrc` prop contains the url of the alternative image to display on hover.

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} hoverSrc={searchResponse.results.mappings.core.hoverImg} alt='image' />
```

### Events

#### onMouseOver
Callback function when the mouse cursor enters the image.

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' onMouseOver={(e)=>{console.log(e)}}/>
```

#### onMouseOut
Callback function when the mouse cursor leaves the image.

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' onMouseOut={(e)=>{console.log(e)}}/>
```

#### onLoad
Callback function when the image loads.

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' onLoad={()=>{}}/>
```

#### onClick
Callback function when the image is clicked.

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' onClick={(e)=>{console.log(e)}}/>
```
