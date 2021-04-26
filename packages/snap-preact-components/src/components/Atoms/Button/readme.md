## Button

Render as unstyled native button, or a div styled like a button based on the optional native prop. can take content or children, styling props available, has the ability to change the onClick functionality. 

## Usage

Content prop

``` jsx
<Button content={"click me!"} onClick={() => somefunc}/>
```
 
Children

``` jsx
<Button onClick={() => somefunc}>
       click me!
</Button>
```
