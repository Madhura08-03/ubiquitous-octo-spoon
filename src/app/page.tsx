import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Layers } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground">
      <Card className="max-w-lg w-full border shadow-sm text-center">
        <CardHeader className="space-y-3 pb-4">
          <div className="flex justify-center">
            <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs font-medium border-primary/20 text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Government of Jharkhand Prototype
            </Badge>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Societal Innovation Collaboration Portal
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-muted-foreground">
            Frontend foundation initialized.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="inline-flex items-center gap-2 rounded-lg bg-muted/50 px-3.5 py-2 text-xs font-mono text-muted-foreground border border-border">
            <Layers className="h-3.5 w-3.5" />
            <span>Task 1 &bull; Next.js App Router + TypeScript + Tailwind CSS</span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}