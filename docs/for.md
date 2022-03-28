# For Loop
The **for** loop executes a block of code for a certain amount of times.

## Statement
### Grammar
```ebnf
for_stmt = 'for' assignment ',' expression delimit statements 'end'
```

### Example
Iterates over the range 0 to 5 (last number is exclusive):
```
for i = 0, 5
    print('Hello!')
end
```

Iterates over the range 0 to 10 with step 2 (0, 2, 4, 6, 8)
```
for i = 0, 10, 2
    print('Hello again!')
end
```

### Break and Continue
**For loops** can use the `break` keyword to exit the loop early or the `continue` keyword to stop and continue with the next iteration.

## One-liner
### Grammar
```ebnf
for_oneline	= 'for' assignment ',' expression 'do' statement;
```

### Example
```
for i = 0, 5 do print('waiting...')
```
