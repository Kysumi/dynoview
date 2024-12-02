import { Button } from "@renderer/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@renderer/components/Card";
import { AlertCircle, Home } from "lucide-react";
import { Link, useRouteError } from "react-router-dom";

export const ErrorElement = () => {
  const error = useRouteError();

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>{error instanceof Error ? error.message : "An unexpected error occurred"}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
