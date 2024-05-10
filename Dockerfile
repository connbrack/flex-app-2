# Build the React front end as build step
FROM node:20-alpine as build-step
WORKDIR /app
ADD ./front .
RUN yarn install
RUN yarn build

# Copy front end build to python image
FROM python:3.12
WORKDIR /app
RUN mkdir front
RUN mkdir front/build
COPY --from=build-step /app/build /app/front/build

# Set up backend
RUN mkdir back
ADD ./back /app/back
WORKDIR /app/back
RUN pip install -r requirements.txt
RUN pip install gunicorn
RUN playwright install chromium
RUN playwright install-deps

# Expose port and run gunicorn
EXPOSE 10000
CMD ["gunicorn", "-b", ":10000", "app:app"]

