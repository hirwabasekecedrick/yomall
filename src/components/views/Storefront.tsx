'use client';
import React, { useState } from 'react';
import { X, TriangleAlert, Megaphone } from 'lucide-react';
import PhonePreview from '@/components/PhonePreview';
import StorefrontComposer, { StorefrontPost } from '@/components/StorefrontComposer';
import CreditsTopUpModal from '@/components/CreditsTopUpModal';
import { Badge } from '@/components/ui';
import { productsData, initialUwPosts, INITIAL_CREDITS_BALANCE, relTime } from '@/lib/data';
import { useToast } from '@/components/Toast';

type Tab = 'profile' | 'compose' | 'published';

export default function StorefrontView() {
  const toast = useToast();
  const [tab, setTab] = useState<Tab>('profile');
  const [shopOpen, setShopOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toggles, setToggles] = useState([true, true, false]);
  const [dirty, setDirty] = useState(false);

  const [posts, setPosts] = useState<StorefrontPost[]>(initialUwPosts as StorefrontPost[]);
  const [credits, setCredits] = useState(INITIAL_CREDITS_BALANCE);
  const [composerOpen, setComposerOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);

  function flip(i: number) {
    setToggles(p => p.map((v, idx) => idx === i ? !v : v));
    setDirty(true);
  }

  function handlePublish() {
    setDirty(false);
    toast(shopOpen ? 'Storefront published — live on the mall guide app' : 'Changes saved — shop is currently marked closed');
  }

  return (
    <div className="view-panel">
      <div className="section-title">
        <div>
          <h2 style={{display:'flex',alignItems:'center'}}>Storefront {shopOpen ? <Badge type="published" label="Live" /> : <Badge type="draft" label="Closed" />}</h2>
          <div className="hint">Editing: <b>Nyabugogo TechHub</b> — G-14 · content publishes straight to the mall guide app</div>
        </div>
        {tab === 'profile' && (
          <div style={{display:'flex',gap:8}}>
            <button className="btn ghost" onClick={() => setPreviewOpen(true)}>Preview</button>
            <button className="btn primary" style={dirty ? {} : {opacity:.6}} onClick={handlePublish}>Publish changes</button>
          </div>
        )}
      </div>

      <div className="subnav-chips">
        <div className={`subnav-chip${tab==='profile'?' active':''}`} onClick={() => setTab('profile')}>Shop profile</div>
        <div className={`subnav-chip${tab==='compose'?' active':''}`} onClick={() => setTab('compose')}>Compose</div>
        <div className={`subnav-chip${tab==='published'?' active':''}`} onClick={() => setTab('published')}>Published posts</div>
      </div>

      {tab === 'profile' && (
        <div className="w-full max-w-[600px]">
          <div className="card" style={{marginBottom:18}}>
            <div className="card-head"><h3>Shop profile</h3></div>
            <div className="card-body">
              <div className="form-row"><label>Shop name</label><input defaultValue="Nyabugogo TechHub" onChange={() => setDirty(true)} /></div>
              <div className="form-row"><label>Category</label>
                <select defaultValue="Electronics" onChange={() => setDirty(true)}>
                  <option>Electronics</option><option>Fashion</option><option>Food &amp; beverage</option><option>Beauty</option>
                </select>
              </div>
              <div className="form-row"><label>Description</label><textarea defaultValue="Your go-to shop for phones, accessories and gadgets in Kigali." onChange={() => setDirty(true)} /></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div className="form-row"><label>Opening time</label><input defaultValue="08:00" type="time" onChange={() => setDirty(true)} /></div>
                <div className="form-row"><label>Closing time</label><input defaultValue="20:00" type="time" onChange={() => setDirty(true)} /></div>
              </div>
              <div>
                <div className="toggle-row">
                  <div><div className="t-label">Shop is open</div><div className="t-hint">Customers see you as open right now</div></div>
                  <button className={`switch ${shopOpen ? 'on' : ''}`} aria-label="Toggle shop open" onClick={() => { setShopOpen(v => !v); setDirty(true); }}><div className="knob"></div></button>
                </div>
                {([['Show in mall guide','Customers can discover your shop'],['Accept online orders','Receive orders through yoDeals'],['Show promotions','Display deals on the homepage']] as [string,string][]).map(([lbl,hint],i) => (
                  <div key={lbl} className="toggle-row">
                    <div><div className="t-label">{lbl}</div><div className="t-hint">{hint}</div></div>
                    <button className={`switch ${toggles[i] ? 'on' : ''}`} aria-label={`Toggle ${lbl}`} onClick={() => flip(i)}><div className="knob"></div></button>
                  </div>
                ))}
              </div>
              <button className="btn primary" style={{marginTop:14,width:'100%',justifyContent:'center',opacity:dirty ? 1 : .7}} onClick={handlePublish}>{dirty ? 'Save & publish changes' : 'Everything is published'}</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'compose' && (
        <div className="w-full max-w-[600px]">
          <div className="credits-bar">
            <div className="cr-ic">🪙</div>
            <div><div className="cr-label">Credits balance</div><div className="cr-value">{credits} credits</div></div>
            <button className="cr-topup" onClick={() => setTopUpOpen(true)}>+ Top up</button>
          </div>
          <button className="btn primary" style={{width:'100%',justifyContent:'center',gap:6,marginBottom:16}} onClick={() => setComposerOpen(true)}><Megaphone size={15} /> New update</button>
          <div className="card">
            <div className="card-head"><h3>Recent posts</h3></div>
            <div className="card-body">
              {posts.length === 0 && <div className="empty-state">No posts yet.</div>}
              {posts.slice(0, 5).map(p => (
                <div key={p.id} className="list-row">
                  <div className="lr-avatar" style={{background: p.type==='deal' ? 'var(--color-amber-100)' : 'var(--color-forest-100)', color: p.type==='deal' ? 'var(--color-amber-600)' : 'var(--color-forest-700)'}}>{p.type==='deal' ? '🏷️' : '📣'}</div>
                  <div><div className="lr-title">{p.headline}</div><div className="lr-sub">{p.channels.join(', ')} · {relTime(p.publishedAt)}</div></div>
                  <div className="lr-right"><Badge type="published" label="Published" /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'published' && (
        <div className="w-full max-w-[600px]">
          <div className="card">
            <div className="card-head"><h3>All published posts</h3></div>
            <div className="card-body">
              {posts.length === 0 && <div className="empty-state">No posts published yet. Everything you publish will be listed here.</div>}
              {posts.map(p => (
                <div key={p.id} className="list-row">
                  <div className="lr-avatar" style={{background: p.type==='deal' ? 'var(--color-amber-100)' : 'var(--color-forest-100)', color: p.type==='deal' ? 'var(--color-amber-600)' : 'var(--color-forest-700)'}}>{p.type==='deal' ? '🏷️' : '📣'}</div>
                  <div><div className="lr-title">{p.headline}</div><div className="lr-sub">{p.channels.join(', ')} · {p.cost} credits · {relTime(p.publishedAt)}</div></div>
                  <div className="lr-right"><Badge type="published" label="Published" /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {previewOpen && (
        <div className="modal-overlay show" onClick={() => setPreviewOpen(false)}>
          <div className="preview-modal" onClick={e => e.stopPropagation()}>
            <div className="preview-modal-head">
              <div className="pm-title">Live preview</div>
              <button aria-label="Close" className="pm-close" onClick={() => setPreviewOpen(false)}><X size={16} /></button>
            </div>
            {dirty && <div className="preview-draft-banner show" style={{marginBottom:0,display:'flex',alignItems:'center',gap:6}}><TriangleAlert size={13} /> Previewing unpublished changes</div>}
            <div style={{transform:'scale(0.95)', transformOrigin:'top center'}}>
              <PhonePreview shopName="Nyabugogo TechHub" shopCategory="Electronics" shopLocation="Unit G-14" isOpen={shopOpen} products={productsData} />
            </div>
          </div>
        </div>
      )}

      <StorefrontComposer
        show={composerOpen}
        onClose={() => setComposerOpen(false)}
        creditsBalance={credits}
        onSpendCredits={(n) => setCredits(c => Math.max(0, c - n))}
        onOpenTopUp={() => setTopUpOpen(true)}
        onPublish={(post) => { setPosts(p => [post, ...p]); toast(`Published — "${post.headline}" is live`); }}
      />
      <CreditsTopUpModal
        show={topUpOpen}
        onClose={() => setTopUpOpen(false)}
        creditsBalance={credits}
        onConfirm={(amount, method) => { setCredits(c => c + amount); setTopUpOpen(false); toast(`${amount} credits added via ${method}`); }}
      />
    </div>
  );
}
