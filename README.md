# ĀNANDA: Senior–Junior Guidance Connect

> **BELONG • LEARN • CARE • GROW**  
> *"Do not impress your junior with how much you know. Help your junior understand what to do next."*

ĀNANDA is a production-quality institutional mentoring and student progress monitoring web application developed for universities. It connects senior students (5th/7th semester) with first-semester students to provide grounded, realistic, and actionable guidance during their critical transition into university life.

---

## 🏛️ What Makes ĀNANDA Unique

ĀNANDA is **not an LMS, placement portal, or social network**. It is an **institutional progress monitoring and guidance platform** built on core educational principles:
- **Experience Over Theory**: Seniors share what they actually did in semester 1—what worked, what failed, and what they would do differently.
- **Fundamentals Before Trends**: Grounding students in C programming, calculus, and lab safety before chasing technology trends or hype.
- **Action Over Overload**: Every mentoring session results in a **maximum of one or two concrete next actions**.
- **Institutional Safety Net**: Serious wellbeing, harassment, safety, or personal matters are immediately escalated and referred to university support cells.
- **No Competitive Mentor Rankings**: Analytics are used strictly to identify inactive groups and improve institutional support.

---

## 👥 Primary User Personas & Roles

1. **Super Admin (Dean of Student Welfare / Central Admin)**
   - Executive institutional dashboard with 90-day pilot KPIs
   - Algorithmic Matching Center with multi-factor compatibility scoring and manual overrides
   - Mentor & Junior student directory with multi-facet filters
   - Institutional safety and escalation triage center
   - Success stories review and publication
   - Program settings (pilot dates, 21-day inactivity threshold, matching weights)
   - Immutable audit logs for institutional compliance

2. **Faculty / Department Coordinator**
   - Department-scoped dashboard (e.g., Computer Science & Engineering)
   - Inactive groups tracker flagging pairs without interactions exceeding threshold days
   - Departmental action completion rates and goals monitoring
   - Student escalation reviews and counseling referrals
   - Department-level report generation

3. **Senior Mentor (5th & 7th Semester Students)**
   - "My Juniors" dashboard with mentee goals, past interactions, and next sessions
   - Quick **Record Mentoring Interaction** form enforcing the **2-action item maximum** rule
   - Action item due dates and completion tracking
   - Confidential escalation mechanism to raise concerns for student safety

4. **Junior Student (1st Semester Students)**
   - *"Let's figure out your next step"* student hub
   - My Mentor profile view with senior's verified skills, interests, and bio
   - First-semester goal tracker and inline editor
   - Interactive **Next Actions Checklist** with instant click-to-complete checkboxes
   - **5-Question Monthly Junior Pulse** survey (one submission per student per month)
   - 1-click **Request Guidance** connect form

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Analytics & Visualizations**: Recharts (Monthly interaction velocity, feedback histograms, departmental breakdowns)
- **Database & Backend Architecture**:
  - Full PostgreSQL / Supabase schema provided in [`supabase/schema.sql`](./supabase/schema.sql) with Row-Level Security (RLS) policies, triggers, and indices.
  - Reactive, LocalStorage-backed client data engine with instant data persistence and a one-click seed data reset button.

---

## 🚀 Getting Started

### 1. Installation

```bash
cd scratch/ananda-guidance-connect
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The application will launch at `http://localhost:5173/`.

### 3. Build for Production

```bash
npm run build
```

---

## 🔑 Preconfigured Demo Accounts

Use any of the following accounts or use the **Quick Persona Switcher** dropdown in the navigation bar:

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Super Admin** | Prof. Rajesh K. Sundaram (DSW) | `admin@university.edu` | *(Any password / 1-click)* |
| **Coordinator** | Dr. Sunita Raman (CSE) | `coordinator@university.edu` | *(Any password / 1-click)* |
| **Senior Mentor** | Aarav Sharma (7th Sem CSE) | `mentor@university.edu` | *(Any password / 1-click)* |
| **Junior Student** | Aditi Deshpande (1st Sem CSE) | `junior@university.edu` | *(Any password / 1-click)* |

---

## 🧪 Validated Success Criteria Workflows

The application fulfills all 17 required institutional workflows:
1. **Admin creates mentor & junior**: Verified via *Mentors & Juniors* → *Register New Student / Mentor*.
2. **System suggests match**: Algorithmic scoring evaluates academic program (25%), interests (25%), guidance areas (20%), skills (15%), availability (10%), and experience (5%).
3. **Admin approves / reassigns match**: Available in *Matching Center*.
4. **Mentor sees junior & records interaction**: Mentors record sessions with mandatory learning outcomes and **at most 2 next actions**.
5. **Junior views & completes actions**: Dynamic checklist allows toggling status with real-time progress calculations.
6. **Junior submits Monthly Pulse**: 5-question survey tracks interaction, usefulness (1-5), clarity (1-5), and next guidance needs.
7. **Attention Required widget**: Flags open escalations, inactive groups (>21 days), overdue actions, and low feedback.
8. **Escalations & Safety triage**: Prominently warns mentors against resolving serious wellbeing/safety concerns independently, routing them to university counselors.
9. **Success Stories workflow**: Draft → Submit → Admin Approve & Publish.
10. **90-Day Pilot progress**: Interactive phase tracker (Phases 1 to 5).
11. **Reports & Exports**: CSV downloads and print-ready stylesheet for Program, Department, Mentor, and Junior progress dossiers.
