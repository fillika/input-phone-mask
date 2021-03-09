# input-phone-mask
Simple input mask for phone.Only phones. Vanilla JS. It's very light (less 13kb after gzip);

# Get started
```
const config = {
    mask: '([9]99) [999]-99-99',
    countryCode: 7,
    prefix: '+',
    placeholder: false
}

const input = new EasyPhoneMask(
    document.querySelector('input'),
    config
)
```
# mask
***Required***
Any character function will be insert to input. For example mask (999) 99\*99-99 be like ***(912) 12\*34-56***.


9 - it's any number

[9] - it's only one nine

([98]9) - first two numbers only 9 or 8.

([9]87) 22 - first nubmer only 9, second only 8, third only seven etc.

# countryCode
It's string or number.

# prefix
If you want to use prefix, like +7 or +3 before phone number.

# placeholder
Boolean or string. It's replace HTML placeholder.