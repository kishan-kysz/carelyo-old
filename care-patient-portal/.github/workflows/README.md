# CREATE DOCKER IMAGE AUTOMATICALLY

## CREATES IMAGE FOR PRODUCTION, STAGING, AND DEVELOP
The createimage.yml will create a docker image when a pull-request or push is made to the following branch:
* develop
* staging
* production

## CREATES IMAGE FOR A SPECIFIC BRANCH
In the case that you want to create an image for your current branch then you should run the branchimage.yml.

All you need to do is run the branchimage.yml and then enter the name of your branch and that will create a docker image that you can test locally.

## HOW TO LOGIN TO GITHUB REGISTRY
Generate a [PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

```
export CR_PAT=YOUR_TOKEN
```
```
echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
```

## HOW TO PULL FROM GITHUB REGISTRY
Pull the container image with @YOUR_SHA_VALUE after the image name.

```
docker pull ghcr.io/NAMESPACE/IMAGE_NAME:latest

OR

docker pull ghcr.io/NAMESPACE/IMAGE_NAME@sha256:82jf9a84u29hiasldj289498uhois8498hjs29hkuhs
```

## WHERE TO FIND ALL IMAGES
Here is where you will find all the docker images [Packages](https://github.com/orgs/Carelyo/packages)

