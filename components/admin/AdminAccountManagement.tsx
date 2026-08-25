"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Eye,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";

// ============================================================
// TYPES
// ============================================================

interface LICAccount {
  _id: string;
  fullName: string;
  employeeId?: string;
  department?: string;
  contactNumber?: string;
  email: string;
  emailVerified?: boolean;
  role?: string;
  mustChangePassword?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface TeacherAccount {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

type AccountTab = "all" | "lic" | "teachers" | "students";

type AccountType = "Lab-in-Charge" | "Teacher" | "Student";

interface AccountRow {
  id: string;
  name: string;
  type: AccountType;
  identifier: string;
  department: string;
  email: string;
  contactNumber: string;
  verified: boolean;
  createdAt?: string;
}

interface LICFormData {
  fullName: string;
  employeeId: string;
  department: string;
  contactNumber: string;
  email: string;
  tempPassword: string;
}

interface EditLICFormData {
  fullName: string;
  employeeId: string;
  department: string;
  contactNumber: string;
  email: string;
}

// ============================================================
// COMPONENT
// ============================================================

export default function AdminAccountManagement() {
  const [licAccounts, setLicAccounts] = useState<LICAccount[]>([]);
  const [teacherAccounts, setTeacherAccounts] = useState<TeacherAccount[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creatingLIC, setCreatingLIC] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const [showCreateLIC, setShowCreateLIC] = useState(false);

  const [activeTab, setActiveTab] = useState<AccountTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedAccount, setSelectedAccount] =
    useState<AccountRow | null>(null);

  const [editingAccount, setEditingAccount] =
    useState<AccountRow | null>(null);

  const [licForm, setLICForm] = useState<LICFormData>({
    fullName: "",
    employeeId: "",
    department: "",
    contactNumber: "",
    email: "",
    tempPassword: "",
  });

  const [editLICForm, setEditLICForm] = useState<EditLICFormData>({
    fullName: "",
    employeeId: "",
    department: "",
    contactNumber: "",
    email: "",
  });

  // ============================================================
  // FETCH ACCOUNTS
  // ============================================================

  const fetchAccounts = async () => {
    try {
      setRefreshing(true);

      const [licResponse, teacherResponse] = await Promise.all([
        fetch("/api/admin/lics", {
          cache: "no-store",
        }),
        fetch("/api/admin/teachers", {
          cache: "no-store",
        }),
      ]);

      if (!licResponse.ok) {
        throw new Error("Failed to fetch Lab-in-Charge accounts.");
      }

      if (!teacherResponse.ok) {
        throw new Error("Failed to fetch teacher accounts.");
      }

      const licData = await licResponse.json();
      const teacherData = await teacherResponse.json();

      setLicAccounts(Array.isArray(licData) ? licData : []);
      setTeacherAccounts(Array.isArray(teacherData) ? teacherData : []);
    } catch (error) {
      console.error("Account management fetch error:", error);
      toast.error("Unable to load account data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // ============================================================
  // CREATE LIC FORM
  // ============================================================

  const handleLICInputChange = (
    field: keyof LICFormData,
    value: string
  ) => {
    if (field === "contactNumber") {
      const digitsOnly = value.replace(/\D/g, "");

      setLICForm((previous) => ({
        ...previous,
        contactNumber: digitsOnly.slice(0, 11),
      }));

      return;
    }

    setLICForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetLICForm = () => {
    setLICForm({
      fullName: "",
      employeeId: "",
      department: "",
      contactNumber: "",
      email: "",
      tempPassword: "",
    });
  };

  const generateTempPassword = () => {
    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

    let password = "";

    for (let i = 0; i < 10; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setLICForm((previous) => ({
      ...previous,
      tempPassword: password,
    }));
  };

  const openCreateLIC = () => {
    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

    let password = "";

    for (let i = 0; i < 10; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setLICForm({
      fullName: "",
      employeeId: "",
      department: "",
      contactNumber: "",
      email: "",
      tempPassword: password,
    });

    setShowCreateLIC(true);
  };

  // ============================================================
  // CREATE LIC
  // ============================================================

  const handleCreateLIC = async (event: React.FormEvent) => {
    event.preventDefault();

    const fullName = licForm.fullName.trim();
    const employeeId = licForm.employeeId.trim();
    const department = licForm.department.trim();
    const contactNumber = licForm.contactNumber.trim();
    const email = licForm.email.trim().toLowerCase();
    const tempPassword = licForm.tempPassword.trim();

    if (!fullName) {
      toast.error("Please enter the full name.");
      return;
    }

    if (!employeeId) {
      toast.error("Please enter the employee ID.");
      return;
    }

    if (!department) {
      toast.error("Please enter the department.");
      return;
    }

    if (!contactNumber) {
      toast.error("Please enter the contact number.");
      return;
    }

    if (
      contactNumber.length !== 11 ||
      !contactNumber.startsWith("09")
    ) {
      toast.error(
        "Contact number must be an 11-digit Philippine mobile number starting with 09."
      );
      return;
    }

    if (!email) {
      toast.error("Please enter the email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!tempPassword) {
      toast.error("Please generate a temporary password.");
      return;
    }

    try {
      setCreatingLIC(true);

      const response = await fetch("/api/admin/create-lic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          employeeId,
          department,
          contactNumber,
          email,
          tempPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to create LIC account."
        );
      }

      toast.success("Lab-in-Charge account created successfully.");

      setShowCreateLIC(false);
      resetLICForm();

      await fetchAccounts();
    } catch (error) {
      console.error("Create LIC error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create LIC account."
      );
    } finally {
      setCreatingLIC(false);
    }
  };

  // ============================================================
  // OPEN EDIT LIC
  // ============================================================

  const openEditLIC = (account: AccountRow) => {
    if (account.type !== "Lab-in-Charge") {
      toast.error("Only Lab-in-Charge accounts can be edited.");
      return;
    }

    setSelectedAccount(null);

    setEditLICForm({
      fullName: account.name === "—" ? "" : account.name,
      employeeId:
        account.identifier === "—" ? "" : account.identifier,
      department:
        account.department === "—" ? "" : account.department,
      contactNumber:
        account.contactNumber === "—"
          ? ""
          : account.contactNumber,
      email: account.email === "—" ? "" : account.email,
    });

    setEditingAccount(account);
  };

  // ============================================================
  // EDIT FORM INPUT
  // ============================================================

  const handleEditLICInputChange = (
    field: keyof EditLICFormData,
    value: string
  ) => {
    if (field === "contactNumber") {
      const digitsOnly = value.replace(/\D/g, "");

      setEditLICForm((previous) => ({
        ...previous,
        contactNumber: digitsOnly.slice(0, 11),
      }));

      return;
    }

    setEditLICForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ============================================================
  // UPDATE LIC
  // ============================================================

  const handleUpdateLIC = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!editingAccount) {
      return;
    }

    const fullName = editLICForm.fullName.trim();
    const employeeId = editLICForm.employeeId.trim();
    const department = editLICForm.department.trim();
    const contactNumber = editLICForm.contactNumber.trim();
    const email = editLICForm.email.trim().toLowerCase();

    if (!fullName) {
      toast.error("Please enter the full name.");
      return;
    }

    if (!employeeId) {
      toast.error("Please enter the employee ID.");
      return;
    }

    if (!department) {
      toast.error("Please enter the department.");
      return;
    }

    if (!contactNumber) {
      toast.error("Please enter the contact number.");
      return;
    }

    if (
      contactNumber.length !== 11 ||
      !contactNumber.startsWith("09")
    ) {
      toast.error(
        "Contact number must be an 11-digit Philippine mobile number starting with 09."
      );
      return;
    }

    if (!email) {
      toast.error("Please enter the email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setSavingEdit(true);

      const response = await fetch(
        `/api/admin/lics/${editingAccount.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            employeeId,
            department,
            contactNumber,
            email,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Failed to update LIC account."
        );
      }

      toast.success("LIC account updated successfully.");

      await fetchAccounts();

      setEditingAccount(null);
    } catch (error) {
      console.error("Update LIC error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update LIC account."
      );
    } finally {
      setSavingEdit(false);
    }
  };

  // ============================================================
  // COMMON ACCOUNT ROWS
  // ============================================================

  const allAccounts = useMemo<AccountRow[]>(() => {
    const licRows: AccountRow[] = licAccounts.map((account) => ({
      id: account._id,
      name: account.fullName || "Unnamed LIC",
      type: "Lab-in-Charge",
      identifier: account.employeeId || "—",
      department: account.department || "—",
      email: account.email || "—",
      contactNumber: account.contactNumber || "—",
      verified: account.emailVerified ?? false,
      createdAt: account.createdAt,
    }));

    const teacherRows: AccountRow[] = teacherAccounts.map(
      (teacher) => ({
        id: teacher._id,
        name: teacher.name || "Unnamed Teacher",
        type: "Teacher",
        identifier: "—",
        department: "—",
        email: teacher.email || "—",
        contactNumber: "—",
        verified: true,
        createdAt: teacher.createdAt,
      })
    );

    return [...licRows, ...teacherRows];
  }, [licAccounts, teacherAccounts]);

  // ============================================================
  // FILTER ACCOUNTS
  // ============================================================

  const filteredAccounts = useMemo(() => {
    let accounts = allAccounts;

    if (activeTab === "lic") {
      accounts = accounts.filter(
        (account) => account.type === "Lab-in-Charge"
      );
    }

    if (activeTab === "teachers") {
      accounts = accounts.filter(
        (account) => account.type === "Teacher"
      );
    }

    if (activeTab === "students") {
      return [];
    }

    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return accounts;
    }

    return accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(query) ||
        account.email.toLowerCase().includes(query) ||
        account.identifier.toLowerCase().includes(query) ||
        account.department.toLowerCase().includes(query)
    );
  }, [allAccounts, activeTab, searchQuery]);

  const totalAccounts =
    licAccounts.length + teacherAccounts.length;

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date?: string) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return <AccountManagementLoading />;
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <>
      <div className="space-y-7">
        {/* HEADER */}

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />

                <span className="text-xs font-semibold text-green-600">
                  Account System Active
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#800000] sm:text-3xl">
                Account Management
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Create and manage Lab-in-Charge accounts,
                teachers, and other registered users.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchAccounts}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#800000]/10 bg-white px-4 py-2.5 text-sm font-medium text-[#800000] shadow-sm transition hover:border-[#800000]/20 hover:bg-[#800000]/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />

                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              <button
                type="button"
                onClick={openCreateLIC}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#800000] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#650000] hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
                Create LIC
              </button>
            </div>
          </div>
        </section>

        {/* STATISTICS */}

        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AccountStatCard
              title="Total Accounts"
              value={totalAccounts}
              label="registered accounts"
              icon={<Users className="h-5 w-5" />}
              accent="maroon"
            />

            <AccountStatCard
              title="Lab-in-Charge"
              value={licAccounts.length}
              label="LIC accounts"
              icon={<ShieldCheck className="h-5 w-5" />}
              accent="gold"
            />

            <AccountStatCard
              title="Teachers"
              value={teacherAccounts.length}
              label="teacher accounts"
              icon={<UserCog className="h-5 w-5" />}
              accent="blue"
            />

            <AccountStatCard
              title="Students"
              value="—"
              label="in development"
              icon={<Users className="h-5 w-5" />}
              accent="gray"
            />
          </div>
        </section>

        {/* ACCOUNT DIRECTORY */}

        <section>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-[#800000]" />

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#800000]" />

              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#800000]/70">
                Account Directory
              </h2>
            </div>

            <div className="h-px flex-1 bg-gradient-to-r from-[#800000]/10 to-transparent" />
          </div>

          <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <CardContent className="p-0">
              {/* TABS */}

              <div className="border-b border-gray-100 px-4 pt-4 sm:px-5">
                <div className="flex gap-1 overflow-x-auto">
                  <AccountTabButton
                    active={activeTab === "all"}
                    onClick={() => setActiveTab("all")}
                    icon={<Users className="h-4 w-4" />}
                    label="All Accounts"
                    count={totalAccounts}
                  />

                  <AccountTabButton
                    active={activeTab === "lic"}
                    onClick={() => setActiveTab("lic")}
                    icon={<ShieldCheck className="h-4 w-4" />}
                    label="Lab-in-Charge"
                    count={licAccounts.length}
                  />

                  <AccountTabButton
                    active={activeTab === "teachers"}
                    onClick={() => setActiveTab("teachers")}
                    icon={<UserCog className="h-4 w-4" />}
                    label="Teachers"
                    count={teacherAccounts.length}
                  />

                  <AccountTabButton
                    active={activeTab === "students"}
                    onClick={() => setActiveTab("students")}
                    icon={<Users className="h-4 w-4" />}
                    label="Students"
                    disabled
                  />
                </div>
              </div>

              {/* TOOLBAR */}

              <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="relative w-full sm:max-w-md">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.target.value)
                    }
                    placeholder="Search by name, email, ID, or department..."
                    disabled={activeTab === "students"}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-9 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#800000]/30 focus:bg-white focus:ring-2 focus:ring-[#800000]/5 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Activity className="h-3.5 w-3.5" />

                  <span>
                    {filteredAccounts.length}{" "}
                    {filteredAccounts.length === 1
                      ? "account"
                      : "accounts"}{" "}
                    shown
                  </span>
                </div>
              </div>

              {activeTab === "students" && (
                <StudentDevelopmentState />
              )}

              {activeTab !== "students" && (
                <>
                  {filteredAccounts.length > 0 ? (
                    <AccountTable
                      accounts={filteredAccounts}
                      onView={setSelectedAccount}
                    />
                  ) : (
                    <EmptyAccountState
                      hasSearch={Boolean(searchQuery.trim())}
                      onClearSearch={() => setSearchQuery("")}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </section>

        {/* SECURITY */}

        <Card className="overflow-hidden rounded-xl border border-[#800000]/10 bg-white shadow-sm">
          <CardContent className="p-0">
            <div className="flex flex-col gap-4 border-l-4 border-[#800000] bg-[#800000]/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-[#800000]">
                    Account Security
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Account information can be managed securely.
                    Passwords and sensitive authentication data are
                    never displayed.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Protected
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CREATE LIC MODAL */}

      {showCreateLIC && (
        <CreateLICModal
          form={licForm}
          loading={creatingLIC}
          onChange={handleLICInputChange}
          onGeneratePassword={generateTempPassword}
          onSubmit={handleCreateLIC}
          onClose={() => {
            if (!creatingLIC) {
              setShowCreateLIC(false);
              resetLICForm();
            }
          }}
        />
      )}

      {/* ACCOUNT DETAILS */}

      {selectedAccount && (
        <AccountDetailsModal
          account={selectedAccount}
          formatDate={formatDate}
          onClose={() => setSelectedAccount(null)}
          onEdit={() => openEditLIC(selectedAccount)}
        />
      )}

      {/* EDIT LIC MODAL */}

      {editingAccount && (
        <EditLICModal
          account={editingAccount}
          form={editLICForm}
          loading={savingEdit}
          onChange={handleEditLICInputChange}
          onSubmit={handleUpdateLIC}
          onClose={() => {
            if (!savingEdit) {
              setEditingAccount(null);
            }
          }}
        />
      )}
    </>
  );
}

// ============================================================
// CREATE LIC MODAL
// ============================================================

function CreateLICModal({
  form,
  loading,
  onChange,
  onGeneratePassword,
  onSubmit,
  onClose,
}: {
  form: LICFormData;
  loading: boolean;
  onChange: (
    field: keyof LICFormData,
    value: string
  ) => void;
  onGeneratePassword: () => void;
  onSubmit: (event: React.FormEvent) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Close create LIC modal"
        onClick={onClose}
        disabled={loading}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-[#800000]/10 bg-white shadow-2xl">
        <div className="border-b border-gray-100 bg-[#800000]/[0.025] px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#800000]/5 text-[#800000]">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Account Management
                </p>

                <h3 className="mt-0.5 text-base font-bold text-[#800000]">
                  Create Lab-in-Charge
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="max-h-[75vh] overflow-y-auto"
        >
          <div className="space-y-5 p-5">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#800000]/70">
                Personal Information
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Full Name"
                  required
                  className="sm:col-span-2"
                >
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(event) =>
                      onChange("fullName", event.target.value)
                    }
                    placeholder="e.g. Juan Dela Cruz"
                    disabled={loading}
                    className={inputClassName}
                  />
                </FormField>

                <FormField label="Employee ID" required>
                  <input
                    type="text"
                    value={form.employeeId}
                    onChange={(event) =>
                      onChange("employeeId", event.target.value)
                    }
                    placeholder="e.g. 21-0465-495"
                    disabled={loading}
                    className={inputClassName}
                  />
                </FormField>

                <FormField label="Department" required>
                  <input
                    type="text"
                    value={form.department}
                    onChange={(event) =>
                      onChange("department", event.target.value)
                    }
                    placeholder="e.g. Computer Engineering"
                    disabled={loading}
                    className={inputClassName}
                  />
                </FormField>

                <FormField label="Contact Number" required>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    value={form.contactNumber}
                    onChange={(event) =>
                      onChange(
                        "contactNumber",
                        event.target.value
                      )
                    }
                    placeholder="09XXXXXXXXX"
                    disabled={loading}
                    className={inputClassName}
                  />
                </FormField>

                <FormField label="Email Address" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      onChange("email", event.target.value)
                    }
                    placeholder="lic@example.com"
                    disabled={loading}
                    className={inputClassName}
                  />
                </FormField>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#800000]/70">
                Login Information
              </p>

              <div className="rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/[0.06] p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#8a6b00]" />

                  <div>
                    <p className="text-xs font-semibold text-[#8a6b00]">
                      Temporary Password
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-gray-500">
                      This temporary password will be used by the
                      LIC for their first login.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={form.tempPassword}
                    readOnly
                    disabled={loading}
                    className="h-10 flex-1 rounded-lg border border-gray-200 bg-white px-3 font-mono text-sm font-semibold tracking-wider text-gray-700 outline-none"
                  />

                  <button
                    type="button"
                    onClick={onGeneratePassword}
                    disabled={loading}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#800000]/15 bg-white px-4 text-xs font-semibold text-[#800000] transition hover:bg-[#800000]/5 disabled:opacity-50"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Generate
                  </button>
                </div>
              </div>

              {/* WARNING */}

              <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                <div>
                  <p className="text-xs font-semibold text-amber-700">
                    Important
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-amber-700/80">
                    Keep the temporary password secure. The LIC
                    should change this password after their first
                    login and should not share their login
                    credentials with other users.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#800000] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#650000] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create LIC Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// EDIT LIC MODAL
// ============================================================

function EditLICModal({
  account,
  form,
  loading,
  onChange,
  onSubmit,
  onClose,
}: {
  account: AccountRow;
  form: EditLICFormData;
  loading: boolean;
  onChange: (
    field: keyof EditLICFormData,
    value: string
  ) => void;
  onSubmit: (event: React.FormEvent) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-[2px]">
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="absolute inset-0 cursor-default"
        aria-label="Close edit LIC modal"
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-[#800000]/10 bg-white shadow-2xl">
        {/* HEADER */}

        <div className="border-b border-gray-100 bg-[#800000]/[0.025] px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#800000]/5 text-[#800000]">
                <Edit3 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Account Management
                </p>

                <h3 className="mt-0.5 text-base font-bold text-[#800000]">
                  Edit Lab-in-Charge
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* FORM */}

        <form onSubmit={onSubmit}>
          <div className="max-h-[70vh] overflow-y-auto p-5">
            <div className="mb-5 rounded-xl border border-[#800000]/10 bg-[#800000]/[0.025] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Editing Account
              </p>

              <p className="mt-1 text-sm font-semibold text-[#800000]">
                {account.name}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Full Name"
                required
                className="sm:col-span-2"
              >
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(event) =>
                    onChange("fullName", event.target.value)
                  }
                  disabled={loading}
                  className={inputClassName}
                />
              </FormField>

              <FormField label="Employee ID" required>
                <input
                  type="text"
                  value={form.employeeId}
                  onChange={(event) =>
                    onChange("employeeId", event.target.value)
                  }
                  disabled={loading}
                  className={inputClassName}
                />
              </FormField>

              <FormField label="Department" required>
                <input
                  type="text"
                  value={form.department}
                  onChange={(event) =>
                    onChange("department", event.target.value)
                  }
                  disabled={loading}
                  className={inputClassName}
                />
              </FormField>

              <FormField label="Contact Number" required>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={11}
                  value={form.contactNumber}
                  onChange={(event) =>
                    onChange(
                      "contactNumber",
                      event.target.value
                    )
                  }
                  placeholder="09XXXXXXXXX"
                  disabled={loading}
                  className={inputClassName}
                />

                <p className="mt-1.5 text-[10px] text-gray-400">
                  11 digits, starting with 09
                </p>
              </FormField>

              <FormField label="Email Address" required>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    onChange("email", event.target.value)
                  }
                  disabled={loading}
                  className={inputClassName}
                />
              </FormField>
            </div>

            {/* WARNING */}

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

              <div>
                <p className="text-xs font-semibold text-amber-700">
                  Warning
                </p>

                <p className="mt-1 text-[11px] leading-5 text-amber-700/80">
                  Please verify the information before saving.
                  Changes made here will update the LIC account
                  information in the system. The password will
                  remain unchanged.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#800000]/10 bg-[#800000]/[0.025] p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#800000]" />

                <div>
                  <p className="text-xs font-semibold text-[#800000]">
                    Security Notice
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-gray-500">
                    Editing this account will not change the LIC's
                    password or authentication credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}

          <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#800000] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#650000] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// FORM FIELD
// ============================================================

function FormField({
  label,
  required = false,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
        {label}

        {required && (
          <span className="ml-1 text-[#800000]">*</span>
        )}
      </label>

      {children}
    </div>
  );
}

// ============================================================
// INPUT STYLE
// ============================================================

const inputClassName = `
  h-10
  w-full
  rounded-lg
  border
  border-gray-200
  bg-gray-50
  px-3
  text-sm
  text-gray-700
  outline-none
  transition
  placeholder:text-gray-400
  focus:border-[#800000]/30
  focus:bg-white
  focus:ring-2
  focus:ring-[#800000]/5
  disabled:cursor-not-allowed
  disabled:opacity-60
`;

// ============================================================
// ACCOUNT STAT CARD
// ============================================================

function AccountStatCard({
  title,
  value,
  label,
  icon,
  accent,
}: {
  title: string;
  value: number | string;
  label: string;
  icon: React.ReactNode;
  accent: "maroon" | "gold" | "blue" | "gray";
}) {
  const styles = {
    maroon: {
      border: "border-[#800000]/15",
      iconBg: "bg-[#800000]/5",
      iconColor: "text-[#800000]",
      value: "text-[#800000]",
    },
    gold: {
      border: "border-[#FFD700]/40",
      iconBg: "bg-[#FFD700]/10",
      iconColor: "text-[#b88600]",
      value: "text-[#b88600]",
    },
    blue: {
      border: "border-blue-100",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      value: "text-blue-600",
    },
    gray: {
      border: "border-gray-100",
      iconBg: "bg-gray-50",
      iconColor: "text-gray-500",
      value: "text-gray-600",
    },
  };

  const style = styles[accent];

  return (
    <Card
      className={`rounded-xl border bg-white ${style.border} shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-gray-500">
            {title}
          </span>

          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.iconBg} ${style.iconColor}`}
          >
            {icon}
          </div>
        </div>

        <div className="mt-4 flex items-end gap-2">
          <span
            className={`text-2xl font-bold sm:text-3xl ${style.value}`}
          >
            {value}
          </span>

          <span className="mb-1 text-xs text-gray-400">
            {label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// ACCOUNT TAB BUTTON
// ============================================================

function AccountTabButton({
  active,
  onClick,
  icon,
  label,
  count,
  disabled = false,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex shrink-0 items-center gap-2 rounded-t-lg px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-[#800000]/5 text-[#800000]"
          : "text-gray-500 hover:bg-gray-50 hover:text-[#800000]"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {icon}

      <span>{label}</span>

      {typeof count === "number" && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            active
              ? "bg-[#800000] text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {count}
        </span>
      )}

      {disabled && (
        <span className="rounded-full bg-[#FFD700]/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#8a6b00]">
          Soon
        </span>
      )}

      {active && (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#800000]" />
      )}
    </button>
  );
}

// ============================================================
// ACCOUNT TABLE
// ============================================================

function AccountTable({
  accounts,
  onView,
}: {
  accounts: AccountRow[];
  onView: (account: AccountRow) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/70">
            <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Account
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Type
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              ID
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Department
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Email
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Status
            </th>

            <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {accounts.map((account) => (
            <tr
              key={`${account.type}-${account.id}`}
              className="group transition hover:bg-[#800000]/[0.018]"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      account.type === "Lab-in-Charge"
                        ? "bg-[#800000]/5 text-[#800000]"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {account.type === "Lab-in-Charge" ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <UserCog className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {account.name}
                    </p>

                    <p className="truncate text-xs text-gray-400">
                      {account.email}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4">
                <AccountTypeBadge type={account.type} />
              </td>

              <td className="px-4 py-4">
                <span className="font-mono text-xs text-gray-500">
                  {account.identifier}
                </span>
              </td>

              <td className="px-4 py-4">
                <span className="text-xs text-gray-500">
                  {account.department}
                </span>
              </td>

              <td className="max-w-[220px] px-4 py-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-gray-300" />

                  <span className="truncate text-xs text-gray-500">
                    {account.email}
                  </span>
                </div>
              </td>

              <td className="px-4 py-4">
                <StatusBadge verified={account.verified} />
              </td>

              <td className="px-5 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onView(account)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-sm transition hover:border-[#800000]/20 hover:bg-[#800000]/5 hover:text-[#800000]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// ACCOUNT TYPE BADGE
// ============================================================

function AccountTypeBadge({
  type,
}: {
  type: AccountType;
}) {
  if (type === "Lab-in-Charge") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#800000]/5 px-2.5 py-1 text-[10px] font-semibold text-[#800000]">
        <ShieldCheck className="h-3 w-3" />
        LIC
      </span>
    );
  }

  if (type === "Teacher") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
        <UserCog className="h-3 w-3" />
        Teacher
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
      <Users className="h-3 w-3" />
      Student
    </span>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
  verified,
}: {
  verified: boolean;
}) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600">
        <CheckCircle2 className="h-3 w-3" />
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD700]/10 px-2.5 py-1 text-[10px] font-semibold text-[#8a6b00]">
      <Activity className="h-3 w-3" />
      Pending
    </span>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyAccountState({
  hasSearch,
  onClearSearch,
}: {
  hasSearch: boolean;
  onClearSearch: () => void;
}) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
        {hasSearch ? (
          <Search className="h-6 w-6" />
        ) : (
          <Users className="h-6 w-6" />
        )}
      </div>

      <h3 className="text-sm font-semibold text-gray-700">
        {hasSearch
          ? "No accounts found"
          : "No accounts available"}
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">
        {hasSearch
          ? "No account matches your current search. Try another name, email, ID, or department."
          : "There are currently no accounts available in this category."}
      </p>

      {hasSearch && (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-4 rounded-lg bg-[#800000] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#650000]"
        >
          Clear Search
        </button>
      )}
    </div>
  );
}

// ============================================================
// STUDENT DEVELOPMENT STATE
// ============================================================

function StudentDevelopmentState() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-5 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#800000]/5 text-[#800000]">
        <Users className="h-7 w-7" />
      </div>

      <h3 className="text-lg font-bold text-[#800000]">
        Student Management
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        Student account management is currently being developed
        and will be integrated into the administrator dashboard
        once the student module is ready.
      </p>

      <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#FFD700]/40 bg-[#FFD700]/10 px-3 py-2 text-xs font-medium text-[#8a6b00]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" />
        Module in development
      </div>
    </div>
  );
}

// ============================================================
// ACCOUNT DETAILS MODAL
// ============================================================

function AccountDetailsModal({
  account,
  formatDate,
  onClose,
  onEdit,
}: {
  account: AccountRow;
  formatDate: (date?: string) => string;
  onClose: () => void;
  onEdit: () => void;
}) {
  const canEdit = account.type === "Lab-in-Charge";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Close account details"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[#800000]/10 bg-white shadow-2xl">
        {/* HEADER */}

        <div className="border-b border-gray-100 bg-[#800000]/[0.025] px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  account.type === "Lab-in-Charge"
                    ? "bg-[#800000]/5 text-[#800000]"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {account.type === "Lab-in-Charge" ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : (
                  <UserCog className="h-5 w-5" />
                )}
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Account Details
                </p>

                <h3 className="mt-0.5 text-base font-bold text-[#800000]">
                  {account.name}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* CONTENT */}

        <div className="max-h-[70vh] overflow-y-auto p-5">
          <div className="mb-5">
            <AccountTypeBadge type={account.type} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <DetailItem
              label="Full Name"
              value={account.name}
            />

            <DetailItem
              label="Account Type"
              value={account.type}
            />

            <DetailItem
              label="Employee / Student ID"
              value={account.identifier}
            />

            <DetailItem
              label="Department"
              value={account.department}
            />

            <DetailItem
              label="Email"
              value={account.email}
            />

            <DetailItem
              label="Contact Number"
              value={account.contactNumber}
            />

            <DetailItem
              label="Email Status"
              value={
                account.verified
                  ? "Verified"
                  : "Not verified"
              }
            />

            <DetailItem
              label="Registered"
              value={formatDate(account.createdAt)}
            />
          </div>

          {/* WARNING SIGN */}

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-bold text-amber-700">
                  Important Account Notice
                </p>

                <p className="mt-1.5 text-[11px] leading-5 text-amber-700/80">
                  This account contains sensitive user
                  information. Please verify the account details
                  carefully before making any changes. Do not
                  share passwords or authentication credentials.
                </p>
              </div>
            </div>
          </div>

          {/* SECURITY INFORMATION */}

          <div className="mt-4 rounded-xl border border-[#800000]/10 bg-[#800000]/[0.025] p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#800000]" />

              <div>
                <p className="text-xs font-semibold text-[#800000]">
                  Security Information
                </p>

                <p className="mt-1 text-[11px] leading-5 text-gray-500">
                  Passwords and authentication credentials are
                  hidden and are never displayed in this interface.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            Close
          </button>

          {canEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#800000] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#650000]"
            >
              <Edit3 className="h-4 w-4" />
              Edit LIC
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DETAIL ITEM
// ============================================================

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-medium text-gray-700">
        {value || "—"}
      </p>
    </div>
  );
}

// ============================================================
// LOADING
// ============================================================

function AccountManagementLoading() {
  return (
    <div className="space-y-7">
      <section>
        <div className="animate-pulse">
          <div className="mb-2 h-3 w-28 rounded bg-gray-200" />
          <div className="h-8 w-64 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-full max-w-2xl rounded bg-gray-100" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="rounded-xl border border-gray-100 shadow-sm"
          >
            <CardContent className="p-5">
              <div className="animate-pulse">
                <div className="flex justify-between">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-9 w-9 rounded-lg bg-gray-100" />
                </div>

                <div className="mt-4 h-8 w-16 rounded bg-gray-100" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
        <CardContent className="p-0">
          <div className="border-b border-gray-100 p-5">
            <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-gray-100" />
          </div>

          <div className="space-y-4 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-4"
              >
                <div className="h-9 w-9 rounded-lg bg-gray-100" />

                <div className="flex-1">
                  <div className="h-3 w-40 rounded bg-gray-100" />
                  <div className="mt-2 h-2.5 w-56 rounded bg-gray-100" />
                </div>

                <div className="hidden h-6 w-20 rounded-full bg-gray-100 sm:block" />

                <div className="h-8 w-16 rounded-lg bg-gray-100" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}