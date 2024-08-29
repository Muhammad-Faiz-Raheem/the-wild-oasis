"use client";

import { useSession } from "next-auth/react";

function AuthNavigation() {
  const { data: session } = useSession();
  console.log(session);
}

export default AuthNavigation;
