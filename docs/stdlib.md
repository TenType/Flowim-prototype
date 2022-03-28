# Standard Library
This prototype only comes with a few built-in variables and functions, but there will definitely be more added in the main version!

## Variables
### pi
A floating point decimal of pi.
> `let pi: float = 3.141592653589793`

## Functions
### print
Prints to the console.
> `func(text: str)` 
```
print('Hello world!')
```

### clear
Clears the console.
> `func()` 
```
clear()
```

### input
Waits for user input, then returns it.
> `func(): str`
```
var name = input()
```

### eval
Evaluates a string as source code.
> `func(code: str)`
```
eval('5 + 5')
```

### run
Execute a file ending in `.flwm`.
> `func(filePath: str)`
```
run('examples/helloworld.flwm')
```

### symbols
Returns a list of symbols stored in the symbol table.
> `func(): str[]`
```
symbols()
```