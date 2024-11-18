# Use the .NET 6 SDK image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy and restore dependencies
COPY *.csproj .
RUN dotnet restore

# Copy the rest of the application
COPY . .

# Build the application
RUN dotnet publish -c Release -o out

# Use the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# Expose the port
EXPOSE 5000

# Start the application
ENTRYPOINT ["dotnet", "WorkshopTracking.dll"]
