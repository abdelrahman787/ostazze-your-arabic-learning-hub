import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "src/integrations/supabase/previewAuthStorage.ts"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    // LEGACY-ONLY override: files that already used `any` before the rule was
    // restored to error. Do not add files here; remove entries as they are typed.
    files: [
      "src/components/AIChatWidget.tsx",
      "src/components/AdminCourses.tsx",
      "src/components/AdminInvoices.tsx",
      "src/components/BookSessionModal.tsx",
      "src/components/BookingFlowModal.tsx",
      "src/components/BookingManager.tsx",
      "src/components/HeroOrbit.tsx",
      "src/components/MyLessons.tsx",
      "src/components/SalesHub.tsx",
      "src/components/StatsBar.tsx",
      "src/components/TeacherAvailabilityManager.tsx",
      "src/components/admin/AdminTeacherFinance.tsx",
      "src/contexts/AuthContext.tsx",
      "src/lib/perfMonitor.ts",
      "src/pages/Admin.tsx",
      "src/pages/CollegeDetail.tsx",
      "src/pages/CourseDetail.tsx",
      "src/pages/Dashboard.tsx",
      "src/pages/Login.tsx",
      "src/pages/MyBookings.tsx",
      "src/pages/MyCourses.tsx",
      "src/pages/Register.tsx",
      "src/pages/TeacherDashboard.tsx",
      "src/pages/TeacherProfile.tsx",
      "src/pages/Teachers.tsx",
      "supabase/functions/_shared/stripe.ts",
      "supabase/functions/payments-webhook/index.ts",
      "vite.config.ts"
],
    rules: { "@typescript-eslint/no-explicit-any": "warn" },
  },
);
