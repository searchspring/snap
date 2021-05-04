## Image

Renders a Image, with built in fallback and rollover functionality. 

## Usage

### src
Specify required image `src` url

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' />
```

### alt
Specify required image `alt` name

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' />
```

### fallback
Specify optional image `fallback`

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} fallback='https://www.example.com/image.jpg' alt='image' />
```

### hoverSrc
Specify optional image to display on hover using the `hoverSrc` prop

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} hoverSrc={searchResponse.results.mappings.core.hoverImg} alt='image' />
```

### Events

#### onMouseOver
Callback function when mouse cursor enters image.

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' onMouseOver={(e)=>{console.log(e)}}/>
```

#### onMouseOut
Callback function when mouse cursor leaves image.

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' onMouseOut={(e)=>{console.log(e)}}/>
```

#### onLoad
Callback function when image loads.

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' onLoad={()=>{}}/>
```

#### onClick
Callback function when image is clicked.

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' onClick={(e)=>{console.log(e)}}/>
```
