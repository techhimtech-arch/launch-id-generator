import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Crown, LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AppHeader() {
  const { user, signOut } = useAuth();
  const { isSubscribed } = useSubscription();
  const nav = useNavigate();

  return (
    <header className="border-b bg-card/50 backdrop-blur">
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-semibold tracking-tight">
          ID Card Studio
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground px-2">
            Pricing
          </Link>
          {user ? (
            <>
              {isSubscribed && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  <Crown className="h-3 w-3" /> Pro
                </span>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden sm:inline max-w-[140px] truncate">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => nav("/account")}>Account</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => nav("/pricing")}>Subscription</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => { await signOut(); nav("/"); }}>
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => nav("/auth")}>Log in</Button>
              <Button size="sm" onClick={() => nav("/auth?mode=signup")}>Sign up</Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
