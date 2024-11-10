This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tech Stack
Next.js + Typescript, with Material UI

## Getting Started
1) Github repository link: https://github.com/sindhushekar9/Language-Translator-App.git
2) Once the repo is cloned: Run npm install to download all the packages specified in package.json
3) On successfull installation, run the development server: npm run dev or yarn dev or pnpm dev or bun dev
4) Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

## Deployed on Vercel
1) App has also been deployed to Vercel and can be accessed using the link: https://language-translator-nwtjp4zuv-sindhus-projects-10a93c25.vercel.app/
2) Can be logged into vercel with git or through email

## UI Elements
1) Application includes a header with tag line, along with a size 6 grid split
2) The left box includes the joke fetched from Joke API and includes a regenerate button to refetch different set of jokes
3) The right box includes a dropdown to select the language needed for translation, which is fetched from DeepL API
4) Only if a language is selected, the joke on the left will be translated on click of 'Translate' button
5) Responsive from mobile and above

## Future Enhancements
1) Application is developed in a way that it can be scaled up to allow the user to set parameters on fetching the Joke. These could include category, single or two-part, language and quantity of jokes.

## Challenges
1) I'm new to Next.js, and with v15 there's more emphasis on app router instead of pages. This isn't called out evidently so took a tiny bit of time to understand the appropriate folder structure setup.
2) Since JokeAPI can accept a parameter based on single or two-word, the object changes and response can either be of type 'joke' or 'setup' and 'delivery'. 
3) If the amount is beyond 1, the object changes into a type 'jokes' which is an array and then includes the above split.
4) While it worked in local, after deploying to Vercel, DeepL API was unable to fetch languages and translate due to CORS issue. Handled this by specifying allowed headers in next.config.ts as well as vercel.json

## Unit Test Cases
1) Detailed unit test cases attached in excel

