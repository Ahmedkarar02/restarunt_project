1. Use the official Node.js LTS (Long Term Support) version as the base image
FROM node:18-alpine

# 2. Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# 3. Create and set the working directory inside the container
WORKDIR /usr/src/app

# 4. Copy package.json and package-lock.json to leverage Docker's caching mechanism
COPY package*.json ./

# 5. Install production dependencies
RUN npm install --only=production

# 6. Copy the rest of the application code, including app.js, public, and views folders
COPY . .

# 7. Create a non-root user for security purposes
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 8. Change ownership of the application files to the non-root user
RUN chown -R appuser:appgroup /usr/src/app

# 9. Switch to the non-root user
USER appuser

# 10. Expose the port that the app runs on
EXPOSE 3000

# 11. Define the command to run the application
CMD ["npm", "start"]