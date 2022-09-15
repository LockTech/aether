# Introduction to Testing

RedwoodJS provides [a variety of tools](https://redwoodjs.com/docs/testing) to facilitate testing an application. These tools are best considered as a new best friend.

## Testing in Isolation

One of the prominent features of these tools is the ability to test your application in isolation. It's trivial to test individual components, services, or even lines of code — and this ability should be leveraged where possible. In practice, this often means developing the API and web-sides independently using tests (`yarn rw test [api]`) and visual confirmation (i.e. [Storybook](https://redwoodjs.com/docs/storybook)) to assert expected results.
