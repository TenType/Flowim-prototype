# Function
A **function** is an executable block of code that perform a task.

You can call a function by using its name followed by a pair of parentheses `()`:
```
myFunc()
```

## Statement
### Grammar
```ebnf
func_stmt	= 'func' identifier
            '(' [identifier (',' identifier)*] ')'
            delimit statements 'end';
```

### Examples
```
func sayHello()
    print('Hello!')
end

func sayMyName(name)
    print('Your name is ' & name & '!')
end
```

### Return Example
Functions can also return values using the `return` keyword, which ends the function:
```
func double(number)
    return number * 2
end
```

## One-liner
### Grammar
```ebnf
func_oneline    = 'func' identifier
                '(' [identifier (',' identifier)*] ')'
                '=' statement;
```

### Examples
Unlike multi-line functions, one-liners implicitly return the value of the statement:
```
func sayHello() = print('Hello!')
func double(number) = number * 2
```

## Anonymous
Functions can also have no name, and thus be **anonymous**. Since they aren't very useful on their own, they are usually passed as parameters to other functions or stored in [variables](variables.md).

## Grammar
The grammar of anonymous functions works the same as named functions, except they don't have a name after the `func` keyword.

### Examples
```
var storedFunction = func()
    print('hello!')
end
```
