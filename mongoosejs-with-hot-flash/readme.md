## Mongodb Tips:

- You should always use pluras names (e.g., `users`, `persons`), otherwise mongodb will itself change the name to plurals itself. Below is a list of unexpected possible behaviour if you try to use singular names:

```bash
user -> users
person -> people
people -> peoples
```
