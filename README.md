# EasyPhoneMask
Simple input mask for phone. Only phones. ***Not working in IE11***.  
Vanilla JS. It's very light (less 13kb after gzip) and have a simple config.

# Get started
```js
const config = {
    mask: '([9]99) [999]-99-99',
    countryCode: 7,
    prefix: '+',
    placeholder: false
}

const iMask = new EasyPhoneMask(
    document.querySelector('input'),
    config
)
```

```ts
mask?: string;
countryCode?: number | string;
prefix?: string;
placeholder?: boolean | string;
```
# Attributes
## mask
Any character (except [] and letters) will be insert to input. For example mask (999) 99\*99-99 be like ***(912) 12\*34-56***.  
Default mask is '(999) 999-99-99'


9 - it's any number  
[9] - it's only one nine  
([98]9) - first two numbers only 9 or 8.  
([9]87) 22 - first number only 9, second only 8, third only seven etc.

## countryCode
It's string or number.

## prefix
If you want to use prefix, like +7 or +3 before phone number.

## placeholder
Boolean or string. It's replace HTML placeholder.

# Methods

## unmask
```js
iMask.unmask();
```
If you need to unmask input.

## reinit
```js
iMask.reinit(config)
```
If you need reinit mask with new config use **reinit** method.