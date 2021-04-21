## Image

Renders a Image, with built in fallback and rollover functionality. 

## Usage

 Default

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} alt='image' />
```

 Custom fallback image

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} fallback='https://www.telegraph.co.uk/content/dam/Pets/spark/royal-canin/happy-puppy-xlarge.jpg?imwidth=1200' alt='image' />
```

 Rollover image

``` jsx
<Image src={searchResponse.results.mappings.core.imageUrl} hoverSrc={searchResponse.results.mappings.core.hoverImg} alt='image' />
```
