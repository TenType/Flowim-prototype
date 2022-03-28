# If...Else
The **if** statement and expression checks a condition, then executes a block of code based on if it was true or not.

## Statement
### Grammar
```ebnf
if_stmt =   'if' condition delimit statements
            ('elif' condition delimit statements)*
            ['else' delimit statements]
            'end';
```

### Example
```
if name == 'foo'
    print('foo!')
elif name == 'bar'
    print('bar.')
else
    print('new user!')
end
```

## Expression
The **if** expression acts as a conditional ternary operator:

### Grammar
```ebnf
if_expr =   'if' condition 'then' expression
            ('elif' condition 'then' expression)*
            ['else' expression];
```

### Example
```
var admin = if name == 'baz' then true else false
```