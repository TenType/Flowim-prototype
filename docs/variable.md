# Variable
A **variable** is a container that stores a [literal](literals.md) (values of data).

## Usage
Declare variables using the `var` keyword and the equal sign `=`.
```
var text = 'hello!'
```

You can reassign a variable that has already been declared by omitting the `var` keyword:
```
text = 'bye!'
```

To use a variable, simply use its name:
```
text
```

## Grammar
```ebnf
variable   = 'var' assignment;
assignment = identifier '=' expression;
```
