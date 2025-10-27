// src/Recruitment/ApplicantMasterData.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  UserPlus2,
  List as ListIcon,
  ActivitySquare,
  IdCard,
  GraduationCap,
  Award,
  Users,
  NotebookPen,
} from "lucide-react";

/* helpers */
const yearsBetween = (from) => {
  if (!from) return "";
  const a = new Date(from), b = new Date();
  let yrs = b.getFullYear() - a.getFullYear();
  const m = b.getMonth() - a.getMonth();
  if (m < 0 || (m === 0 && b.getDate() < a.getDate())) yrs--;
  return Math.max(0, yrs);
};
const ageFromDob = (dob) => yearsBetween(dob);

/* floating wrappers (use your snippet) */
const FloatInput = ({
  label,
  required,
  type = "text",
  value,
  onChange,
  readOnly,
  step,
  className = "",
  asterisk = true,
  ...rest
}) => {
  const needsForce = type === "date" || type === "datetime-local";
  const forceFloat = needsForce && value;
  return (
    <div className="relative w-full">
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        readOnly={readOnly}
        step={step}
        placeholder=" "
        className={`peer global-tran-textbox-ui ${className}`}
        {...rest}
      />
      <label className={`global-tran-floating-label ${forceFloat ? "-top-2 translate-y-0 scale-90" : ""}`}>
        {asterisk && required ? <span className="global-tran-asterisk-ui">* </span> : null}
        {label}
      </label>
    </div>
  );
};

const FloatReadOnly = ({ label, value }) => (
  <div className="relative w-full">
    <input value={value ?? ""} readOnly placeholder=" " className="peer global-tran-textbox-ui" />
    <label className="global-tran-floating-label -top-2 translate-y-0 scale-90">{label}</label>
  </div>
);

const FloatSelect = ({ label, required, value, onValueChange, children }) => {
  const hasValue = !!value;
  return (
    <div className="relative w-full">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="peer global-tran-textbox-ui h-[44px] sm:h-[44px] lg:h-[48px] flex items-center">
          <SelectValue placeholder=" " />
        </SelectTrigger>
        <SelectContent className="z-[60]">{children}</SelectContent>
      </Select>
      <label className={`global-tran-floating-label ${hasValue ? "-top-2 translate-y-0 scale-90" : ""}`}>
        {required ? <span className="global-tran-asterisk-ui">* </span> : null}
        {label}
      </label>
    </div>
  );
};

/* model */
const emptyForm = {
  // Application-level
  applicantNo: "",
  applicationDate: "",

  // Personal
  lastName: "",
  firstName: "",
  middleName: "",
  nickName: "",
  height: "",
  weight: "",
  bloodType: "",
  mobileNos: "",
  email: "",
  address1: "",
  addr1ContactNo: "",
  addr1StartDate: "",
  address2: "",
  addr2ContactNo: "",
  addr2StartDate: "",
  gender: "",
  dob: "",
  placeOfBirth: "",
  civilStatus: "",
  citizenship: "",
  religion: "",
  active: "No",
  sssNo: "",
  tin: "",
  philhealthNo: "",
  pagibigNo: "",
  icePerson: "",
  iceRelationship: "",
  iceContactNo: "",
  iceAddress: "",
  preferredArea: "",
  expectedSalary: "",
  currentSalary: "",
  registeredBy: "",
  registeredDate: "",
  lastUpdatedBy: "",
  lastUpdatedDate: "",
};

export default function ApplicantMasterData() {
  const [mainTab, setMainTab] = useState("setup");
  const [subTab, setSubTab] = useState("personal");
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [list] = useState([]);
  const [logs] = useState([]);

  const handle = (k) => (e) => setForm((s) => ({ ...s, [k]: e?.target ? e.target.value : e }));

  const age = useMemo(() => ageFromDob(form.dob), [form.dob]);
  const yrsStay1 = useMemo(() => yearsBetween(form.addr1StartDate), [form.addr1StartDate]);
  const yrsStay2 = useMemo(() => yearsBetween(form.addr2StartDate), [form.addr2StartDate]);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Save applicant payload:", form);
  };
  const onReset = () => setForm(emptyForm);

  return (
    <div className="space-y-4 mt-[60px]">
      {/* Header */}
      <div className="flex items-center justify-between rounded-md border border-[#B6D4FE] bg-[#CFE4FF] px-4 py-2 shadow-sm">
        <span className="text-base md:text-2xl font-semibold text-[#003399]">Applicant Master Data</span>
      </div>

      <div className="mt-1">
        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className="flex w-full justify-start gap-0 rounded-xl border bg-card/60 p-0 shadow-sm divide-x divide-border overflow-hidden">
            {[
              { v: "setup", label: "Applicant Info Set-Up", Icon: UserPlus2 },
              { v: "list", label: "Applicant List", Icon: ListIcon },
              { v: "activities", label: "Activities", Icon: ActivitySquare },
            ].map(({ v, label, Icon }) => (
              <TabsTrigger
                key={v}
                value={v}
                className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-none data-[state=inactive]:text-muted-foreground hover:bg-muted/40"
              >
                <Icon className="h-4 w-4" />
                {label}
                {mainTab === v && (
                  <motion.span
                    layoutId="mainTabHL"
                    className="absolute inset-0 -z-10 bg-primary/10"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {mainTab === "setup" && (
            <form onSubmit={onSubmit} className="space-y-4 w-full mt-2">
              {/* Application Information sits BETWEEN main tabs and sub tabs */}
              <Card>
    <CardContent className="pt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FloatInput
          type="date"
          label="Date of Application"
          value={form.applicationDate}
          onChange={handle("applicationDate")}
          required
        />

        <FloatInput
          label="Application Number"
          value={form.applicantNo}
          onChange={handle("applicantNo")}
          required
        />

        <FloatInput
          label="Name"
          value={form.applicationExtra}
          onChange={handle("applicationExtra")}
        />
      </div>
    </CardContent>
  </Card>

              {/* Sub tabs come AFTER the Application Information */}
              <Tabs value={subTab} onValueChange={setSubTab} className="w-full">
                <TabsList className="mb-3 mt-5 flex justify-start w-full flex-wrap rounded-lg border bg-muted/30 p-0 shadow-inner overflow-hidden divide-x divide-border">
                  {[
                    { v: "personal", label: "Personal Information", Icon: IdCard },
                    { v: "eduemp", label: "Educational & Employment", Icon: GraduationCap },
                    { v: "certs", label: "Certifications", Icon: Award },
                    { v: "family", label: "Family Background", Icon: Users },
                    { v: "pbackground", label: "Personal Background", Icon: NotebookPen },
                  ].map(({ v, label, Icon }) => (
                    <TabsTrigger
                      key={v}
                      value={v}
                      className="relative flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-medium rounded-none data-[state=inactive]:text-muted-foreground hover:bg-muted/30 transition-colors duration-200"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                      {subTab === v && (
                        <motion.span
                          layoutId="subTabHL"
                          className="absolute inset-0 -z-10 bg-background ring-1 ring-border"
                          transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
                        />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="personal" forceMount>
                  {/* 2-column layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* LEFT column (2 cols) => Personal Info + Government IDs underneath */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Personal Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <FloatInput label="Last Name" required value={form.lastName} onChange={handle("lastName")} />
                            <FloatInput label="First Name" required value={form.firstName} onChange={handle("firstName")} />
                            <FloatInput label="Middle Name" value={form.middleName} onChange={handle("middleName")} />
                            <FloatInput label="Nickname" value={form.nickName} onChange={handle("nickName")} />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <FloatInput label="Height" value={form.height} onChange={handle("height")} />
                            <FloatInput label="Weight" value={form.weight} onChange={handle("weight")} />
                            <FloatInput label="Blood Type" value={form.bloodType} onChange={handle("bloodType")} />
                            <div className="md:col-span-2">
                              <FloatInput label="Mobile No/s" value={form.mobileNos} onChange={handle("mobileNos")} />
                            </div>
                            <FloatInput type="email" label="Email Address" value={form.email} onChange={handle("email")} />
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <FloatInput label="Address 1" value={form.address1} onChange={handle("address1")} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <FloatInput label="Contact No." value={form.addr1ContactNo} onChange={handle("addr1ContactNo")} />
                              <FloatInput type="date" label="Start Living Since" value={form.addr1StartDate} onChange={handle("addr1StartDate")} />
                              <FloatReadOnly label="Yrs. of Stay" value={yrsStay1} />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <FloatInput label="Address 2" value={form.address2} onChange={handle("address2")} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <FloatInput label="Contact No." value={form.addr2ContactNo} onChange={handle("addr2ContactNo")} />
                              <FloatInput type="date" label="Start Living Since" value={form.addr2StartDate} onChange={handle("addr2StartDate")} />
                              <FloatReadOnly label="Yrs. of Stay" value={yrsStay2} />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <FloatSelect
                              label="Gender"
                              value={form.gender}
                              onValueChange={(v) => setForm((s) => ({ ...s, gender: v }))}
                            >
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </FloatSelect>
                            <FloatReadOnly label="Age" value={age} />
                            <FloatInput type="date" label="Date of Birth" value={form.dob} onChange={handle("dob")} />
                            <div className="md:col-span-3">
                              <FloatInput label="Place of Birth" value={form.placeOfBirth} onChange={handle("placeOfBirth")} />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div className="md:col-span-2">
                              <FloatSelect
                                label="Civil Status"
                                required
                                value={form.civilStatus}
                                onValueChange={(v) => setForm((s) => ({ ...s, civilStatus: v }))}
                              >
                                <SelectItem value="Single">Single</SelectItem>
                                <SelectItem value="Married">Married</SelectItem>
                                <SelectItem value="Widowed">Widowed</SelectItem>
                                <SelectItem value="Separated">Separated</SelectItem>
                              </FloatSelect>
                            </div>
                            <FloatInput label="Citizenship" value={form.citizenship} onChange={handle("citizenship")} />
                            <div className="md:col-span-2">
                              <FloatInput label="Religion" value={form.religion} onChange={handle("religion")} />
                            </div>
                            <FloatSelect
                              label="Active"
                              value={form.active}
                              onValueChange={(v) => setForm((s) => ({ ...s, active: v }))}
                            >
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </FloatSelect>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Government ID Information — now directly under Personal Info (left column only) */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Government ID Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <FloatInput label="SSS No." value={form.sssNo} onChange={handle("sssNo")} />
                            <FloatInput label="TIN" value={form.tin} onChange={handle("tin")} />
                            <FloatInput label="PhilHealth No." value={form.philhealthNo} onChange={handle("philhealthNo")} />
                            <FloatInput label="Pag-IBIG No." value={form.pagibigNo} onChange={handle("pagibigNo")} />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* RIGHT column: ICE -> Other Info -> Registration */}
                    <div className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">In Case of Emergency</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <FloatInput label="Contact Person" value={form.icePerson} onChange={handle("icePerson")} />
                          <FloatInput label="Relationship" value={form.iceRelationship} onChange={handle("iceRelationship")} />
                          <FloatInput label="Contact No." value={form.iceContactNo} onChange={handle("iceContactNo")} />
                          <FloatInput label="Address" value={form.iceAddress} onChange={handle("iceAddress")} />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Other Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <FloatInput label="Preferred Area of Assignment" value={form.preferredArea} onChange={handle("preferredArea")} />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <FloatInput type="number" step="0.01" label="Expected Salary" value={form.expectedSalary} onChange={handle("expectedSalary")} />
                            <FloatInput type="number" step="0.01" label="Current Salary" value={form.currentSalary} onChange={handle("currentSalary")} />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Registration Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                            <FloatInput label="Registered By" value={form.registeredBy} onChange={handle("registeredBy")} />
                            <FloatInput type="datetime-local" label="Registered Date" value={form.registeredDate} onChange={handle("registeredDate")} />
                            <FloatInput label="Last Updated By" value={form.lastUpdatedBy} onChange={handle("lastUpdatedBy")} />
                            <FloatInput type="datetime-local" label="Last Updated Date" value={form.lastUpdatedDate} onChange={handle("lastUpdatedDate")} />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Actions (optional) */}
              {/* <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={onReset}>Reset</Button>
                <Button type="submit">Save</Button>
              </div> */}
            </form>
          )}


          {/* LIST */}
          {mainTab === "list" && (
            <Card>
              <CardHeader>
                <CardTitle>Applicant List</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <FloatInput label="Search…" value={search} onChange={(e) => setSearch(e.target.value)} asterisk={false} />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Last</TableHead>
                      <TableHead>First</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!list.length && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                          No results
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* ACTIVITIES */}
          {mainTab === "activities" && (
            <Card>
              <CardHeader>
                <CardTitle>Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!logs.length && <div className="text-sm text-muted-foreground">No activity yet.</div>}
              </CardContent>
            </Card>
          )}
        </Tabs>
      </div>
    </div>
  );
}
