# Intro

We made this backend to support requests for both our React-Native application as well as our React-Redux website. It makes sense to have both of these versions make request to the same server rather than writing a different server for both applications. This should help limit the complexity of our application, however may require some creative work arounds to keep this structure viable as we scale up.

# How This Works

I am going to deploy this file to Heroku. I will make it so that as we update the master branch of this server it will update the endpoints. This should make it so that we are all able to test using that endpoint. Other than that, running the file on localhost should be viable.

