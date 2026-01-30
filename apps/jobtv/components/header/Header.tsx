"use client";

import { useState, useEffect } from "react";
import Logo from "./Logo";
import Navigation from "./Navigation";
import GuestActions from "./GuestActions";
import MenuToggleButton from "./MenuToggleButton";
import MobileNavigation from "./MobileNavigation";
import UserMenu from "./UserMenu";
import HeaderContainer from "./HeaderContainer";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <HeaderContainer>
      {/* Logo and Navigation */}
      <div className="flex">
        <Logo />
        <Navigation />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {!loading && (
          <>
            {user ? (
              <UserMenu userName={user.email?.split("@")[0] || "ユーザー"} />
            ) : (
              <>
                <GuestActions className="hidden xl:flex" />
                <MenuToggleButton
                  isOpen={isMenuOpen}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex xl:hidden"
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Mobile menu - アニメーションのために常時レンダリング */}
      {!user && !loading && <MobileNavigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}
    </HeaderContainer>
  );
}
