'use client';
import React from 'react';
import { ArrowRight, Landmark } from 'lucide-react';
import { Badge, KPI } from '@/components/ui';
import { initialLoanApplications, initials, relTime } from '@/lib/data';

export default function LendingView({ onReviewLoan }: { onReviewLoan: (app: unknown) => void }) {
  return (
    <div className="view-panel">
      <div className="context-banner sa-flex" style={{background:'#3A2E12'}}>
        <div className="cb-left" style={{color:'#FDF1DC',fontSize:12.5,display:'flex',alignItems:'center',gap:6}}><Landmark size={14} /> Lending partner module — visible to superadmin only. Not accessible by landlords or tenants.</div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[14px] mb-[22px] mt-[18px]">
        <KPI label="Portfolio disbursed" value="RWF 280,000" delta="across all malls" deltaClass="flat" />
        <KPI label="Active loans" value="1" delta="approved & disbursed" deltaClass="flat" />
        <KPI label="Pending" value="1" delta="awaiting KYC decision" deltaClass="down" />
        <KPI label="Rejected" value="1" delta="did not meet criteria" deltaClass="flat" />
      </div>
      <div className="section-title">
        <div><h2>Loan applications</h2><div className="hint">rentAdvance requests submitted by tenants across every mall on the platform</div></div>
      </div>
      <div className="card" style={{marginBottom:22}}>
        <div className="card-body pt-[16px] overflow-x-auto">
          <table>
            <thead><tr><th>Applicant</th><th>Mall / Unit</th><th>Amount</th><th>Term</th><th>KYC</th><th>Status</th><th>Submitted</th><th></th></tr></thead>
            <tbody>
              {initialLoanApplications.map((app,i) => (
                <tr key={app.id} className="rowhover">
                  <td><div className="cell-tenant"><div className="avatar-sm">{initials(app.tenantName)}</div><div className="tname">{app.tenantName}</div></div></td>
                  <td>{app.mall} · {app.unit}</td>
                  <td className="mono">RWF {app.amount.toLocaleString()}</td>
                  <td>{app.term} · {app.frequency === 'daily' ? 'Daily' : 'Weekly'}</td>
                  <td><Badge type="due" label="Partial" /></td>
                  <td><Badge type={app.status === 'approved' ? 'paid' : app.status === 'rejected' ? 'overdue' : 'due'} label={app.status === 'approved' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : 'Pending'} /></td>
                  <td style={{fontSize:11.5,color:'#8A968D'}}>{relTime(app.submittedAt)}</td>
                  <td><button className="btn ghost" style={{padding:'5px 10px',fontSize:11,gap:4}} onClick={() => onReviewLoan(app)}>Review <ArrowRight size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="section-title"><div><h2>Portfolio risk &amp; exposure</h2><div className="hint">Capital currently outstanding, by how overdue it is</div></div></div>
      <div className="card">
        <div className="card-body">
          {[['Current (not yet due)','0%','#8B5CF6','0'],['1–30 days overdue','100%','#F2A93B','280,000'],['31–60 days overdue','0%','#F5720A','0'],['60+ days overdue','0%','#D64545','0']].map((e,i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[150px_1fr_100px] gap-[4px] sm:gap-[16px] items-center sm:items-center py-[8px]">
              <div style={{fontSize:12.8,fontWeight:600}}>{e[0]}</div>
              <div style={{height:8,background:'#F2EFE6',borderRadius:4,overflow:'hidden'}}><div style={{width:e[1],height:'100%',background:e[2]}}></div></div>
              <div className="mono" style={{textAlign:'right',fontSize:12.8}}>RWF {e[3]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
