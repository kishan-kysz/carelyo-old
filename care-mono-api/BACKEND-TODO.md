Backend TODOS:
UTC Time in the backend:
Change the usages of local time to Unix/UTC time and let the converting of these happen in the frontend to achieve uniform time-handling for the application.

Input validation in controllers:
All controller methods that handle information received from the frontend needs to validate the information before using it/sending it.
1.    Identify controller methods that needs changing (that handles information from the frontend).
2.    Identify what information passes through the controller methods.
3.    Verify the information using input-validation.

Child / Parent relationship:
While services are being migrated into microservices, decouple the children of patients from also being users, to achieve easier handling of children in the application.
There is initial planning for this in draw.io (maybe not comprehensive).

Link to diagram:
[Diagram](https://app.diagrams.net/#HCarelyo%2Fpaymentdoc%2Fdevelop%2FDraw.io%2FCarelyo_Backend_System_1_1.drawio)