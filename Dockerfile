# Build step #1: build the React front end
FROM node:20-alpine as build-step
WORKDIR /app
ADD ./front .
RUN yarn install
RUN yarn build

FROM python:3.12
WORKDIR /app
RUN mkdir front
RUN mkdir front/build
COPY --from=build-step /app/build /app/front/build

RUN mkdir back
ADD ./back /app/back
WORKDIR /app/back
RUN pip install -r requirements.txt
RUN pip install gunicorn
RUN playwright install chromium
RUN playwright install-deps

EXPOSE 5000
CMD ["gunicorn", "-b", ":10000", "app:app"]

