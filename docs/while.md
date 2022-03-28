# While Loop
The **while** loop repeatedly executes a block of code until a condition is met.

## Statement
### Grammar
```ebnf
while_stmt = 'while' condition delimit statements 'end';
```

### Example
```
var i = 0
while i < 5
    print('Hello!')
    i = i + 1
end
```

### Break and Continue
**While loops** can use the `break` keyword to exit the loop early or the `continue` keyword to stop and continue with the next iteration.

## One-liner
### Grammar
```ebnf
while_oneline = 'while' condition 'do' statement;
```

### Example
```
while time < 6 do print('waiting...')
```
