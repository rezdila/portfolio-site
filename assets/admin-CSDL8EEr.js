import{D as l,s as c,c as U,g as J,f as z}from"./utils-CiMyh_tx.js";document.addEventListener("DOMContentLoaded",async()=>{await l.initCloud(),Q(),Y(),V(),W()});function Q(){const t=document.getElementById("password-screen"),e=document.getElementById("admin-app"),a=document.getElementById("admin-login-btn"),s=document.getElementById("admin-password"),n=document.getElementById("login-error");if(sessionStorage.getItem("admin_authenticated")==="true"){t.style.display="none",e.style.display="flex",w("personal"),setTimeout(I,100);return}a.addEventListener("click",()=>o()),s.addEventListener("keydown",i=>{i.key==="Enter"&&o()});function o(){const i=s.value;l.verifyPassword(i)?(sessionStorage.setItem("admin_authenticated","true"),t.style.display="none",e.style.display="flex",w("personal"),setTimeout(I,100)):(n.textContent="Incorrect password. Try again.",n.style.display="block",s.value="",s.classList.add("shake"),setTimeout(()=>s.classList.remove("shake"),500))}}let G="personal";function Y(){const t=document.querySelectorAll(".admin-sidebar__link"),e=document.getElementById("admin-sidebar-toggle"),a=document.querySelector(".admin-sidebar");t.forEach(s=>{s.addEventListener("click",n=>{n.preventDefault();const o=s.dataset.section;o&&(t.forEach(i=>i.classList.remove("active")),t.forEach(i=>i.classList.remove("admin-sidebar__link--active")),s.classList.add("active"),s.classList.add("admin-sidebar__link--active"),w(o),a&&a.classList.remove("sidebar-open"))})}),e&&a&&e.addEventListener("click",()=>{a.classList.toggle("sidebar-open")})}function V(){const t=document.getElementById("export-btn"),e=document.getElementById("import-btn"),a=document.getElementById("import-file-input"),s=document.getElementById("save-all-btn");t&&t.addEventListener("click",()=>{l.exportData(),c("Data exported successfully!","success")}),e&&a&&(e.addEventListener("click",()=>a.click()),a.addEventListener("change",async n=>{const o=n.target.files[0];if(o)try{await l.importData(o),c("Data imported successfully! Reloading...","success"),setTimeout(()=>{w(G)},1e3)}catch(i){c("Import failed: "+i.message,"error")}})),s&&s.addEventListener("click",()=>{c("All changes are auto-saved!","info")})}let x=null;function W(){const t=document.getElementById("admin-modal"),e=document.getElementById("modal-confirm-btn"),a=document.getElementById("modal-cancel-btn");e&&e.addEventListener("click",()=>{t&&t.classList.remove("is-open"),x&&x(!0)}),a&&a.addEventListener("click",()=>{t&&t.classList.remove("is-open"),x&&x(!1)})}function E(t,e){const a=document.getElementById("admin-modal"),s=document.getElementById("modal-title"),n=document.getElementById("modal-message");return s&&(s.textContent=t),n&&(n.textContent=e),a&&a.classList.add("is-open"),new Promise(o=>{x=o})}function w(t){G=t;const e=document.getElementById("admin-page-title"),a={personal:"👤 Personal Info",education:"🎓 Education",professionalQualifications:"🏆 Professional Qualifications",vocationalQualifications:"📜 Vocational Qualifications",experience:"💼 Experience",skills:"⚡ Skills",competencies:"🎯 Competencies",achievements:"🏅 Achievements",personality:"🧠 Personality",interests:"🎮 Interests & Hobbies",swot:"📊 SWOT Analysis",values:"✨ Values",goals:"🎯 Goals",gapAnalysis:"📈 Gap Analysis",actionPlan:"📋 Action Plan",projects:"🚀 Projects",messages:"📬 Messages Inbox",settings:"⚙️ Settings"};e&&(e.textContent=a[t]||t),document.querySelectorAll(".admin-section").forEach(i=>i.style.display="none");const s=document.getElementById(`section-${t}`);s&&(s.style.display="block");const o={personal:re,education:()=>v("education",X),professionalQualifications:()=>v("professionalQualifications",Z),vocationalQualifications:()=>v("vocationalQualifications",K),experience:()=>v("experience",ee),skills:()=>v("skills",te),competencies:()=>v("competencies",ae),achievements:()=>v("achievements",ne),personality:de,interests:()=>v("interests",se),swot:ce,values:()=>v("values",oe),goals:L,gapAnalysis:S,actionPlan:O,projects:()=>v("projects",ie),messages:B,settings:pe}[t];o&&o()}const X=[{key:"degree",label:"Degree / Certificate",type:"text",required:!0},{key:"institution",label:"Institution",type:"text",required:!0},{key:"year",label:"Year / Period",type:"text"},{key:"gpa",label:"GPA",type:"text"},{key:"description",label:"Description",type:"textarea"}],Z=[{key:"title",label:"Title",type:"text",required:!0},{key:"issuer",label:"Issuing Organization",type:"text"},{key:"date",label:"Date",type:"text"},{key:"description",label:"Description",type:"textarea"},{key:"credentialUrl",label:"Credential URL",type:"url"}],K=[{key:"title",label:"Title",type:"text",required:!0},{key:"issuer",label:"Issuing Organization",type:"text"},{key:"date",label:"Date",type:"text"},{key:"description",label:"Description",type:"textarea"}],ee=[{key:"role",label:"Role / Position",type:"text",required:!0},{key:"company",label:"Company / Organization",type:"text",required:!0},{key:"period",label:"Period",type:"text"},{key:"description",label:"Description",type:"textarea"},{key:"type",label:"Type",type:"select",options:["work","internship","volunteer","freelance"]}],te=[{key:"name",label:"Skill Name",type:"text",required:!0},{key:"level",label:"Proficiency Level (0-100)",type:"range",min:0,max:100},{key:"category",label:"Category",type:"text"}],ae=[{key:"name",label:"Competency Name",type:"text",required:!0},{key:"description",label:"Description",type:"textarea"}],ne=[{key:"title",label:"Achievement Title",type:"text",required:!0},{key:"description",label:"Description",type:"textarea"},{key:"date",label:"Date",type:"text"},{key:"category",label:"Category",type:"select",options:["Academic","Professional","Personal","Competition","Other"]}],se=[{key:"name",label:"Interest Name",type:"text",required:!0},{key:"icon",label:"Icon (emoji)",type:"text"},{key:"description",label:"Description",type:"textarea"}],oe=[{key:"name",label:"Value Name",type:"text",required:!0},{key:"description",label:"Description",type:"textarea"}],ie=[{key:"title",label:"Project Title",type:"text",required:!0},{key:"description",label:"Description",type:"textarea"},{key:"techStack",label:"Tech Stack (comma-separated)",type:"text"},{key:"liveUrl",label:"Live Demo URL",type:"url"},{key:"githubUrl",label:"GitHub URL",type:"url"},{key:"youtubeUrl",label:"YouTube URL",type:"url"},{key:"category",label:"Category",type:"text"},{key:"featured",label:"Featured",type:"checkbox"}];function re(){var o,i,d,p,b,r,f,y;const t=document.getElementById("section-personal");if(!t)return;const e=l.getSection("personal");t.innerHTML=`
    <form id="personal-form" class="admin-form">
      <div class="form-row">
        <div class="form-group">
          <label for="personal-fullName">Full Name</label>
          <input type="text" id="personal-fullName" name="fullName" value="${u(e.fullName||"")}" required />
        </div>
        <div class="form-group">
          <label for="personal-title">Professional Title</label>
          <input type="text" id="personal-title" name="title" value="${u(e.title||"")}" />
        </div>
      </div>

      <div class="form-group">
        <label for="personal-bio">Bio</label>
        <textarea id="personal-bio" name="bio" rows="4">${u(e.bio||"")}</textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="personal-email">Email</label>
          <input type="email" id="personal-email" name="email" value="${u(e.email||"")}" />
        </div>
        <div class="form-group">
          <label for="personal-location">Location</label>
          <input type="text" id="personal-location" name="location" value="${u(e.location||"")}" />
        </div>
      </div>

      <div class="form-group">
        <label>Profile Image</label>
        <div class="file-upload" id="profile-image-upload">
          ${e.profileImage?`<img src="${e.profileImage}" class="upload-preview" alt="Profile preview" />`:""}
          <div class="upload-placeholder">
            <span class="upload-icon">📷</span>
            <span>Click or drag to upload profile photo</span>
          </div>
          <input type="file" id="profile-image-input" accept="image/*" class="file-input-hidden" />
        </div>
      </div>

      <h3 class="form-section-title">Social Links</h3>
      <div class="form-row">
        <div class="form-group">
          <label for="personal-linkedin">LinkedIn URL</label>
          <input type="url" id="personal-linkedin" name="linkedin" value="${u(((o=e.socialLinks)==null?void 0:o.linkedin)||"")}" />
        </div>
        <div class="form-group">
          <label for="personal-github">GitHub URL</label>
          <input type="url" id="personal-github" name="github" value="${u(((i=e.socialLinks)==null?void 0:i.github)||"")}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="personal-facebook">Facebook URL</label>
          <input type="url" id="personal-facebook" name="facebook" value="${u(((d=e.socialLinks)==null?void 0:d.facebook)||"")}" />
        </div>
        <div class="form-group">
          <label for="personal-instagram">Instagram URL</label>
          <input type="url" id="personal-instagram" name="instagram" value="${u(((p=e.socialLinks)==null?void 0:p.instagram)||"")}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="personal-threads">Threads URL</label>
          <input type="url" id="personal-threads" name="threads" value="${u(((b=e.socialLinks)==null?void 0:b.threads)||"")}" />
        </div>
        <div class="form-group">
          <label for="personal-tiktok">TikTok URL</label>
          <input type="url" id="personal-tiktok" name="tiktok" value="${u(((r=e.socialLinks)==null?void 0:r.tiktok)||"")}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="personal-whatsapp">WhatsApp URL</label>
          <input type="url" id="personal-whatsapp" name="whatsapp" value="${u(((f=e.socialLinks)==null?void 0:f.whatsapp)||"")}" />
        </div>
        <div class="form-group">
          <label for="personal-website">Website URL</label>
          <input type="url" id="personal-website" name="website" value="${u(((y=e.socialLinks)==null?void 0:y.website)||"")}" />
        </div>
      </div>

      <button type="submit" class="admin-btn admin-btn-primary">💾 Save Personal Info</button>
    </form>
  `;const a=document.getElementById("personal-form");a.addEventListener("submit",g=>{g.preventDefault();const m=new FormData(a),k={...e,fullName:m.get("fullName"),title:m.get("title"),bio:m.get("bio"),email:m.get("email"),location:m.get("location"),socialLinks:{linkedin:m.get("linkedin"),github:m.get("github"),facebook:m.get("facebook"),instagram:m.get("instagram"),threads:m.get("threads"),tiktok:m.get("tiktok"),whatsapp:m.get("whatsapp"),website:m.get("website")}};l.updateSection("personal",k),c("Personal info saved!","success")});const s=document.getElementById("profile-image-upload"),n=document.getElementById("profile-image-input");s.addEventListener("click",()=>n.click()),s.addEventListener("dragover",g=>{g.preventDefault(),s.classList.add("drag-over")}),s.addEventListener("dragleave",()=>{s.classList.remove("drag-over")}),s.addEventListener("drop",g=>{g.preventDefault(),s.classList.remove("drag-over");const m=g.dataTransfer.files[0];m&&P(m,e)}),n.addEventListener("change",g=>{const m=g.target.files[0];m&&P(m,e)})}async function P(t,e){try{const a=await U(t,800,.75);e.profileImage=a,l.updateSection("personal",e);const s=document.querySelector(".upload-preview"),n=document.getElementById("profile-image-upload");if(s)s.src=a;else{const o=document.createElement("img");o.src=a,o.className="upload-preview",o.alt="Profile preview",n.insertBefore(o,n.firstChild)}c("Profile image updated!","success")}catch(a){c(`Failed to update profile image: ${a.message}`,"error")}}function v(t,e){const a=document.getElementById(`section-${t}`);if(!a)return;const s=l.getSection(t),n=Array.isArray(s)?s:[],o=!["skills","competencies","interests","values"].includes(t);a.innerHTML=`
    <div class="admin-list-header">
      <span class="item-count">${n.length} item${n.length!==1?"s":""}</span>
      <button class="admin-btn admin-btn-primary" id="add-${t}-btn">+ Add New</button>
    </div>
    <div class="item-list" id="${t}-list">
      ${n.map(i=>le(t,i,e)).join("")}
    </div>
    <div id="${t}-form-container" style="display:none;"></div>
  `,document.getElementById(`add-${t}-btn`).addEventListener("click",()=>{T(t,null,e,o)}),a.querySelectorAll(".item-edit-btn").forEach(i=>{i.addEventListener("click",()=>{const d=i.dataset.id,p=n.find(b=>b.id===d);p&&T(t,p,e,o)})}),a.querySelectorAll(".item-delete-btn").forEach(i=>{i.addEventListener("click",async()=>{const d=i.dataset.id;await E("Delete Item","Are you sure you want to delete this item? This cannot be undone.")&&(l.deleteItem(t,d),v(t,e),c("Item deleted","success"))})})}function le(t,e,a){const s=a[0],n=a.length>1?a[1]:null,o=e[s.key]||"Untitled",i=n&&e[n.key]||"";let d=o;Array.isArray(o)&&(d=o.join(", "));let p=i;Array.isArray(i)&&(p=i.join(", "));const b=e.level!==void 0?`<div class="item-level-bar"><div class="item-level-fill" style="width:${e.level}%"></div><span>${e.level}%</span></div>`:"",r=e.proofs?e.proofs.length:0,f=r>0?`<span class="item-proofs-badge">📎 ${r} proof${r>1?"s":""}</span>`:"";return`
    <div class="item-card glass-card">
      <div class="item-info">
        <h4 class="item-title">${u(String(d))}</h4>
        <p class="item-subtitle">${u(String(p))}</p>
        ${b}
        ${f}
      </div>
      <div class="item-actions">
        <button class="admin-btn admin-btn-small item-edit-btn" data-id="${e.id}">✏️ Edit</button>
        <button class="admin-btn admin-btn-small admin-btn-danger item-delete-btn" data-id="${e.id}">🗑️ Delete</button>
      </div>
    </div>
  `}function T(t,e,a,s){const n=document.getElementById(`${t}-form-container`);if(!n)return;const o=!!e,i=t;n.style.display="block",n.innerHTML=`
    <div class="admin-item-form glass-card">
      <h3>${o?"Edit":"Add New"} Item</h3>
      <form id="${i}-item-form">
        ${a.map(p=>R(p,e)).join("")}
        ${s?j(e):""}
        <div class="form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">💾 ${o?"Save Changes":"Add Item"}</button>
          <button type="button" class="admin-btn admin-btn-secondary" id="${i}-cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  `,n.scrollIntoView({behavior:"smooth",block:"center"}),document.getElementById(`${i}-cancel-btn`).addEventListener("click",()=>{n.style.display="none",n.innerHTML=""});const d=document.getElementById(`${i}-item-form`);d.addEventListener("submit",p=>{p.preventDefault();const b=new FormData(d),r={};a.forEach(f=>{let y=b.get(f.key);f.type==="checkbox"?y=d.querySelector(`[name="${f.key}"]`).checked:f.type==="range"?y=parseInt(y)||0:f.key==="techStack"&&(y=y?y.split(",").map(g=>g.trim()).filter(Boolean):[]),r[f.key]=y||""}),o?(r.id=e.id,r.proofs=e.proofs||[],l.updateItem(t,e.id,r),c("Item updated!","success")):(r.id=l.generateId(t.substring(0,3)),r.proofs=[],l.addItem(t,r),c("Item added!","success")),n.style.display="none",n.innerHTML="",v(t,a)}),s&&H(t,e)}function R(t,e){const a=e?e[t.key]||"":t.default||"",s=Array.isArray(a)?a.join(", "):a,n=t.required?"required":"";switch(t.type){case"textarea":return`
        <div class="form-group">
          <label for="field-${t.key}">${t.label}</label>
          <textarea id="field-${t.key}" name="${t.key}" rows="3" ${n}>${u(String(s))}</textarea>
        </div>
      `;case"select":return`
        <div class="form-group">
          <label for="field-${t.key}">${t.label}</label>
          <select id="field-${t.key}" name="${t.key}" ${n}>
            ${(t.options||[]).map(o=>`<option value="${o}" ${a===o?"selected":""}>${o.charAt(0).toUpperCase()+o.slice(1)}</option>`).join("")}
          </select>
        </div>
      `;case"range":return`
        <div class="form-group">
          <label for="field-${t.key}">${t.label}: <span id="range-value-${t.key}">${a||50}</span>%</label>
          <input type="range" id="field-${t.key}" name="${t.key}" min="${t.min||0}" max="${t.max||100}" value="${a||50}" 
            oninput="document.getElementById('range-value-${t.key}').textContent = this.value" />
        </div>
      `;case"checkbox":return`
        <div class="form-group form-group-checkbox">
          <label>
            <input type="checkbox" id="field-${t.key}" name="${t.key}" ${a?"checked":""} />
            ${t.label}
          </label>
        </div>
      `;default:return`
        <div class="form-group">
          <label for="field-${t.key}">${t.label}</label>
          <input type="${t.type||"text"}" id="field-${t.key}" name="${t.key}" value="${u(String(s))}" ${n} />
        </div>
      `}}function j(t){return`
    <div class="proof-upload-section">
      <h4>Proof Attachments</h4>
      <div class="proof-list" id="proof-list">
        ${((t==null?void 0:t.proofs)||[]).map((a,s)=>`
          <div class="proof-upload-item">
            <span class="proof-upload-icon">${a.type==="image"?"🖼️":a.type==="pdf"?"📄":a.type==="youtube"?"▶️":"📎"}</span>
            <span class="proof-upload-name">${u(a.name||"Proof")}</span>
            <button type="button" class="admin-btn admin-btn-small admin-btn-danger proof-remove-btn" data-index="${s}">✕</button>
          </div>
        `).join("")}
      </div>
      <div class="proof-upload-actions">
        <div class="file-upload proof-file-upload" id="proof-drop-area">
          <span class="upload-icon">📎</span>
          <span>Drop files here or click to upload (images, PDFs)</span>
          <input type="file" id="proof-file-input" accept="image/*,.pdf,video/*" multiple class="file-input-hidden" />
        </div>
        <p style="font-size: 11px; color: #a78bfa; margin-top: 6px; line-height: 1.3;">
          ⚠️ <strong>Cloud Limit Note:</strong> Files uploaded directly are stored as base64 in your browser. Large files will exceed JSONBin.io's free 100KB database sync limit and won't save to the cloud. To ensure proofs are visible on all devices, we recommend pasting a link below instead.
        </p>
        <div class="form-group" style="margin-top: 1rem;">
          <label for="link-proof-url">Or add file/document URL (Google Drive, Imgur, Dropbox, etc.):</label>
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <input type="text" id="link-proof-name" placeholder="Name (e.g. Certificate)" style="flex: 1;" />
            <input type="url" id="link-proof-url" placeholder="https://..." style="flex: 2;" />
            <button type="button" class="admin-btn admin-btn-small" id="add-link-proof-btn">Add URL</button>
          </div>
        </div>
        <div class="form-group" style="margin-top: 0.75rem;">
          <label for="youtube-proof-url">Or add YouTube URL:</label>
          <div class="input-with-btn">
            <input type="url" id="youtube-proof-url" placeholder="https://youtube.com/watch?v=..." />
            <button type="button" class="admin-btn admin-btn-small" id="add-youtube-proof-btn">Add YouTube</button>
          </div>
        </div>
      </div>
    </div>
  `}function H(t,e){if(!e)return;const a=document.getElementById("proof-drop-area"),s=document.getElementById("proof-file-input"),n=document.getElementById("youtube-proof-url"),o=document.getElementById("add-youtube-proof-btn"),i=document.getElementById("link-proof-url"),d=document.getElementById("link-proof-name"),p=document.getElementById("add-link-proof-btn");a&&s&&(a.addEventListener("click",()=>s.click()),a.addEventListener("dragover",r=>{r.preventDefault(),a.classList.add("drag-over")}),a.addEventListener("dragleave",()=>a.classList.remove("drag-over")),a.addEventListener("drop",r=>{r.preventDefault(),a.classList.remove("drag-over"),C(r.dataTransfer.files,t,e)}),s.addEventListener("change",r=>{C(r.target.files,t,e)})),o&&n&&o.addEventListener("click",()=>{const r=n.value.trim();if(r){const f={type:"youtube",url:r,name:"YouTube Video"};l.addProof(t,e.id,f),e.proofs=e.proofs||[],e.proofs.push(f),n.value="",c("YouTube proof added!","success"),$(e)}}),p&&i&&d&&p.addEventListener("click",()=>{const r=i.value.trim();let f=d.value.trim();if(r){f||(f="External Link");let y="document";const g=r.toLowerCase();g.match(/\.(jpeg|jpg|gif|png|webp|svg|avif)/)?y="image":g.endsWith(".pdf")?y="pdf":g.match(/\.(mp4|webm|ogg|mov|avi)/)&&(y="video");const m={type:y,url:r,name:f};l.addProof(t,e.id,m),e.proofs=e.proofs||[],e.proofs.push(m),i.value="",d.value="",c("Proof URL added!","success"),$(e)}else c("Please enter a valid URL.","warning")});const b=document.getElementById("proof-list");b&&b.addEventListener("click",r=>{const f=r.target.closest(".proof-remove-btn");if(f){const y=parseInt(f.dataset.index);l.removeProof(t,e.id,y),e.proofs.splice(y,1),$(e),c("Proof removed","success")}})}async function C(t,e,a){for(const n of t){if(n.size>1572864){c(`Failed to upload ${n.name}: File is too large. Please use files under 1.5 MB.`,"error");continue}try{const o=J(n.name);let i;o==="image"?i=await U(n,1200,.75):i=await z(n);const d={type:o,url:i,name:n.name};if(!l.addProof(e,a.id,d)){c(`Failed to upload ${n.name}: Storage limit reached.`,"error");continue}a.proofs=a.proofs||[],a.proofs.push(d);const b=l.getCloudConfig();b.apiKey&&b.binId&&n.size>80*1024?c(`"${n.name}" uploaded locally. Since it exceeds 80KB, it cannot sync to the 100KB cloud database. We recommend adding it via URL instead!`,"warning",7e3):c(`Proof "${n.name}" uploaded!`,"success")}catch(o){c(`Failed to upload ${n.name}: ${o.message}`,"error")}}$(a)}function $(t){const e=document.getElementById("proof-list");if(!e)return;const a=t.proofs||[];e.innerHTML=a.map((s,n)=>`
    <div class="proof-upload-item">
      <span class="proof-upload-icon">${s.type==="image"?"🖼️":s.type==="pdf"?"📄":s.type==="youtube"?"▶️":"📎"}</span>
      <span class="proof-upload-name">${u(s.name||"Proof")}</span>
      <button type="button" class="admin-btn admin-btn-small admin-btn-danger proof-remove-btn" data-index="${n}">✕</button>
    </div>
  `).join("")}function de(){const t=document.getElementById("section-personality");if(!t)return;const e=l.getSection("personality");t.innerHTML=`
    <form id="personality-form" class="admin-form">
      <div class="form-row">
        <div class="form-group">
          <label for="mbti-type">MBTI Type</label>
          <input type="text" id="mbti-type" name="mbtiType" value="${u(e.mbtiType||"")}" maxlength="4" placeholder="e.g., INTJ" />
        </div>
        <div class="form-group">
          <label for="mbti-label">MBTI Label</label>
          <input type="text" id="mbti-label" name="mbtiLabel" value="${u(e.mbtiLabel||"")}" placeholder="e.g., Architect" />
        </div>
      </div>
      <div class="form-group">
        <label for="mbti-description">MBTI Description</label>
        <textarea id="mbti-description" name="mbtiDescription" rows="3">${u(e.mbtiDescription||"")}</textarea>
      </div>
      <div class="form-group">
        <label for="career-key">Career Key Results</label>
        <textarea id="career-key" name="careerKeyResults" rows="3">${u(e.careerKeyResults||"")}</textarea>
      </div>

      ${j({proofs:e.proofs||[]})}

      <button type="submit" class="admin-btn admin-btn-primary">💾 Save Personality</button>
    </form>
  `,H("personality",e);const a=document.getElementById("personality-form");a.addEventListener("submit",s=>{s.preventDefault();const n=new FormData(a),o={...e,mbtiType:n.get("mbtiType"),mbtiLabel:n.get("mbtiLabel"),mbtiDescription:n.get("mbtiDescription"),careerKeyResults:n.get("careerKeyResults")};l.updateSection("personality",o),c("Personality info saved!","success")})}function ce(){const t=document.getElementById("section-swot");if(!t)return;const e=l.getSection("swot"),a=[{key:"strengths",label:"💪 Strengths",color:"cyan"},{key:"weaknesses",label:"⚠️ Weaknesses",color:"pink"},{key:"opportunities",label:"🚀 Opportunities",color:"emerald"},{key:"threats",label:"🔥 Threats",color:"amber"}];t.innerHTML=`
    <form id="swot-form" class="admin-form">
      <div class="swot-form-grid">
        ${a.map(n=>`
          <div class="swot-form-quadrant swot-form-${n.color}">
            <h4>${n.label}</h4>
            <div class="swot-items" id="swot-${n.key}-items">
              ${(e[n.key]||[]).map((o,i)=>`
                <div class="swot-form-item">
                  <input type="text" name="${n.key}-${i}" value="${u(o)}" />
                  <button type="button" class="admin-btn admin-btn-small admin-btn-danger swot-remove" data-quadrant="${n.key}" data-index="${i}">✕</button>
                </div>
              `).join("")}
            </div>
            <button type="button" class="admin-btn admin-btn-small swot-add" data-quadrant="${n.key}">+ Add</button>
          </div>
        `).join("")}
      </div>
      <button type="submit" class="admin-btn admin-btn-primary">💾 Save SWOT</button>
    </form>
  `,t.querySelectorAll(".swot-add").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.quadrant,i=document.getElementById(`swot-${o}-items`),d=i.children.length,p=document.createElement("div");p.className="swot-form-item",p.innerHTML=`
        <input type="text" name="${o}-${d}" placeholder="Enter item..." />
        <button type="button" class="admin-btn admin-btn-small admin-btn-danger swot-remove" data-quadrant="${o}" data-index="${d}">✕</button>
      `,i.appendChild(p),p.querySelector("input").focus()})}),t.addEventListener("click",n=>{n.target.classList.contains("swot-remove")&&n.target.closest(".swot-form-item").remove()});const s=document.getElementById("swot-form");s.addEventListener("submit",n=>{n.preventDefault();const o={};a.forEach(i=>{const d=[];s.querySelectorAll(`[name^="${i.key}-"]`).forEach(b=>{const r=b.value.trim();r&&d.push(r)}),o[i.key]=d}),l.updateSection("swot",o),c("SWOT Analysis saved!","success")})}function L(){const t=document.getElementById("section-goals");if(!t)return;const e=l.getSection("goals");let a="smart";function s(n){return`
      <div class="item-list">
        ${(e[n]||[]).map(i=>`
          <div class="item-card glass-card">
            <div class="item-info">
              <h4 class="item-title">${u(i.title)}</h4>
              <p class="item-subtitle">Progress: ${i.progress||0}% | Status: ${i.status||"not-started"}</p>
            </div>
            <div class="item-actions">
              <button class="admin-btn admin-btn-small goal-edit-btn" data-id="${i.id}" data-type="${n}">✏️ Edit</button>
              <button class="admin-btn admin-btn-small admin-btn-danger goal-delete-btn" data-id="${i.id}" data-type="${n}">🗑️ Delete</button>
            </div>
          </div>
        `).join("")}
      </div>
      <button class="admin-btn admin-btn-primary goal-add-btn" data-type="${n}">+ Add ${n.toUpperCase()} Goal</button>
      <div id="goal-form-container-${n}" style="display:none;"></div>
    `}t.innerHTML=`
    <div class="admin-tabs">
      <button class="tab-btn active" data-tab="smart">SMART Goals</button>
      <button class="tab-btn" data-tab="safe">SAFE Goals</button>
    </div>
    <div id="goals-tab-content">
      ${s("smart")}
    </div>
  `,t.querySelectorAll(".tab-btn").forEach(n=>{n.addEventListener("click",()=>{t.querySelectorAll(".tab-btn").forEach(o=>o.classList.remove("active")),n.classList.add("active"),a=n.dataset.tab,document.getElementById("goals-tab-content").innerHTML=s(a),F(t,e)})}),F(t,e)}function F(t,e){t.querySelectorAll(".goal-add-btn").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.type;M(s,null,e)})}),t.querySelectorAll(".goal-edit-btn").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.type,n=a.dataset.id,o=e[s].find(i=>i.id===n);o&&M(s,o,e)})}),t.querySelectorAll(".goal-delete-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.type,n=a.dataset.id;await E("Delete Goal","Are you sure?")&&(e[s]=e[s].filter(i=>i.id!==n),l.updateSection("goals",e),L(),c("Goal deleted","success"))})})}function M(t,e,a){const s=document.getElementById(`goal-form-container-${t}`);if(!s)return;const n=!!e,o=t==="smart"?[{key:"title",label:"Goal Title",type:"text"},{key:"specific",label:"Specific",type:"textarea"},{key:"measurable",label:"Measurable",type:"textarea"},{key:"achievable",label:"Achievable",type:"textarea"},{key:"relevant",label:"Relevant",type:"textarea"},{key:"timeBound",label:"Time-Bound",type:"textarea"},{key:"progress",label:"Progress (%)",type:"range",min:0,max:100},{key:"status",label:"Status",type:"select",options:["not-started","in-progress","completed","on-hold"]}]:[{key:"title",label:"Goal Title",type:"text"},{key:"stretch",label:"Stretch",type:"textarea"},{key:"ambitious",label:"Ambitious",type:"textarea"},{key:"flexible",label:"Flexible",type:"textarea"},{key:"everyday",label:"Everyday",type:"textarea"},{key:"progress",label:"Progress (%)",type:"range",min:0,max:100},{key:"status",label:"Status",type:"select",options:["not-started","in-progress","completed","on-hold"]}];s.style.display="block",s.innerHTML=`
    <div class="admin-item-form glass-card">
      <h3>${n?"Edit":"Add"} ${t.toUpperCase()} Goal</h3>
      <form id="goal-edit-form">
        ${o.map(i=>R(i,e)).join("")}
        <div class="form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">💾 Save</button>
          <button type="button" class="admin-btn admin-btn-secondary" id="goal-cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  `,document.getElementById("goal-cancel-btn").addEventListener("click",()=>{s.style.display="none"}),document.getElementById("goal-edit-form").addEventListener("submit",i=>{i.preventDefault();const d=new FormData(i.target),p={};if(o.forEach(b=>{let r=d.get(b.key);b.type==="range"&&(r=parseInt(r)||0),p[b.key]=r||""}),n){p.id=e.id;const b=a[t].findIndex(r=>r.id===e.id);b>=0&&(a[t][b]=p)}else p.id=l.generateId(t),a[t]=a[t]||[],a[t].push(p);l.updateSection("goals",a),L(),c(`Goal ${n?"updated":"added"}!`,"success")})}function S(){const t=document.getElementById("section-gapAnalysis");if(!t)return;const e=l.getSection("gapAnalysis");let a="knowledge";function s(n){return`
      <div class="item-list">
        ${(e[n]||[]).map(i=>`
          <div class="item-card glass-card">
            <div class="item-info">
              <h4 class="item-title">${u(i.current)} → ${u(i.required)}</h4>
              <p class="item-subtitle">Gap: ${u(i.gap)}</p>
            </div>
            <div class="item-actions">
              <button class="admin-btn admin-btn-small gap-edit-btn" data-id="${i.id}" data-type="${n}">✏️</button>
              <button class="admin-btn admin-btn-small admin-btn-danger gap-delete-btn" data-id="${i.id}" data-type="${n}">🗑️</button>
            </div>
          </div>
        `).join("")}
      </div>
      <button class="admin-btn admin-btn-primary gap-add-btn" data-type="${n}">+ Add Gap</button>
      <div id="gap-form-container-${n}" style="display:none;"></div>
    `}t.innerHTML=`
    <div class="admin-tabs">
      <button class="tab-btn active" data-tab="knowledge">Knowledge</button>
      <button class="tab-btn" data-tab="skills">Skills</button>
      <button class="tab-btn" data-tab="experience">Experience</button>
    </div>
    <div id="gap-tab-content">${s("knowledge")}</div>
  `,t.querySelectorAll(".tab-btn").forEach(n=>{n.addEventListener("click",()=>{t.querySelectorAll(".tab-btn").forEach(o=>o.classList.remove("active")),n.classList.add("active"),a=n.dataset.tab,document.getElementById("gap-tab-content").innerHTML=s(a),q(t,e)})}),q(t,e)}function q(t,e){t.querySelectorAll(".gap-add-btn").forEach(a=>{a.addEventListener("click",()=>N(a.dataset.type,null,e))}),t.querySelectorAll(".gap-edit-btn").forEach(a=>{var o;const s=a.dataset.type,n=(o=e[s])==null?void 0:o.find(i=>i.id===a.dataset.id);n&&a.addEventListener("click",()=>N(s,n,e))}),t.querySelectorAll(".gap-delete-btn").forEach(a=>{a.addEventListener("click",async()=>{if(await E("Delete","Delete this gap item?")){const n=a.dataset.type;e[n]=e[n].filter(o=>o.id!==a.dataset.id),l.updateSection("gapAnalysis",e),S(),c("Deleted","success")}})})}function N(t,e,a){const s=document.getElementById(`gap-form-container-${t}`);if(!s)return;const n=!!e;s.style.display="block",s.innerHTML=`
    <div class="admin-item-form glass-card">
      <form id="gap-edit-form">
        <div class="form-group"><label>Current State</label><textarea name="current" rows="2">${u((e==null?void 0:e.current)||"")}</textarea></div>
        <div class="form-group"><label>Required State</label><textarea name="required" rows="2">${u((e==null?void 0:e.required)||"")}</textarea></div>
        <div class="form-group"><label>Gap</label><textarea name="gap" rows="2">${u((e==null?void 0:e.gap)||"")}</textarea></div>
        <div class="form-group"><label>Action Plan</label><textarea name="plan" rows="2">${u((e==null?void 0:e.plan)||"")}</textarea></div>
        <div class="form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">💾 Save</button>
          <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.admin-item-form').parentElement.style.display='none'">Cancel</button>
        </div>
      </form>
    </div>
  `,document.getElementById("gap-edit-form").addEventListener("submit",o=>{o.preventDefault();const i=new FormData(o.target),d={current:i.get("current"),required:i.get("required"),gap:i.get("gap"),plan:i.get("plan")};if(n){d.id=e.id;const p=a[t].findIndex(b=>b.id===e.id);p>=0&&(a[t][p]=d)}else d.id=l.generateId("gap"),a[t]=a[t]||[],a[t].push(d);l.updateSection("gapAnalysis",a),S(),c("Saved!","success")})}function O(){const t=document.getElementById("section-actionPlan");if(!t)return;const e=l.getSection("actionPlan");t.innerHTML=`
    <form id="action-plan-form" class="admin-form">
      ${e.map((a,s)=>`
        <div class="action-plan-year-form glass-card">
          <div class="form-row">
            <div class="form-group">
              <label>Year Label</label>
              <input type="text" name="year-${s}" value="${u(a.year)}" />
            </div>
            <div class="form-group">
              <label>Status</label>
              <select name="status-${s}">
                <option value="not-started" ${a.status==="not-started"?"selected":""}>Not Started</option>
                <option value="in-progress" ${a.status==="in-progress"?"selected":""}>In Progress</option>
                <option value="completed" ${a.status==="completed"?"selected":""}>Completed</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Goals (one per line)</label>
            <textarea name="goals-${s}" rows="4">${(a.goals||[]).join(`
`)}</textarea>
          </div>
        </div>
      `).join("")}
      <button type="button" class="admin-btn admin-btn-secondary" id="add-year-btn">+ Add Year</button>
      <button type="submit" class="admin-btn admin-btn-primary">💾 Save Action Plan</button>
    </form>
  `,document.getElementById("add-year-btn").addEventListener("click",()=>{e.push({id:l.generateId("ap"),year:`Year ${e.length+1}`,goals:[],status:"not-started"}),l.updateSection("actionPlan",e),O()}),document.getElementById("action-plan-form").addEventListener("submit",a=>{a.preventDefault();const s=new FormData(a.target);e.forEach((n,o)=>{n.year=s.get(`year-${o}`)||n.year,n.status=s.get(`status-${o}`)||n.status;const i=s.get(`goals-${o}`)||"";n.goals=i.split(`
`).map(d=>d.trim()).filter(Boolean)}),l.updateSection("actionPlan",e),c("Action Plan saved!","success")})}function pe(){const t=document.getElementById("section-settings");if(!t)return;t.innerHTML=`
    <div class="admin-form">
      <div class="glass-card settings-card">
        <h3>🔑 Change Admin Password</h3>
        <form id="password-form">
          <div class="form-group">
            <label for="current-password">Current Password</label>
            <input type="password" id="current-password" name="currentPassword" required />
          </div>
          <div class="form-group">
            <label for="new-password">New Password</label>
            <input type="password" id="new-password" name="newPassword" required />
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirm New Password</label>
            <input type="password" id="confirm-password" name="confirmPassword" required />
          </div>
          <button type="submit" class="admin-btn admin-btn-primary">Update Password</button>
        </form>
      </div>

      <div class="glass-card settings-card">
        <h3>📦 Data Management</h3>
        <p>Export your portfolio data as a JSON file for backup, or import from a previous export.</p>
        <div class="storage-usage-container" style="margin: 15px 0; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
            <span style="color: var(--text-secondary);">Storage Usage</span>
            <span id="storage-usage-text" style="color: var(--admin-accent); font-weight: 600;">Calculating...</span>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
            <div id="storage-usage-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, var(--admin-accent), var(--admin-purple)); transition: width 0.3s ease;"></div>
          </div>
        </div>
        <div class="settings-actions">
          <button class="admin-btn admin-btn-primary" id="settings-export-btn">📤 Export Data</button>
          <button class="admin-btn admin-btn-secondary" id="settings-import-btn">📥 Import Data</button>
        </div>
      </div>

      <div class="glass-card settings-card">
        <h3>☁️ Cloud Database Sync</h3>
        <p>Sync your portfolio data dynamically using a free cloud database on <strong>JSONBin.io</strong>. This keeps your changes safe when deploying your portfolio to platforms like GitHub Pages, Netlify, or Vercel.</p>
        
        <form id="cloud-sync-form" style="margin-top: 15px;">
          <div class="form-group">
            <label for="cloud-api-key">JSONBin.io API Key (X-Master-Key)</label>
            <input type="password" id="cloud-api-key" name="apiKey" placeholder="Pasted API Key" />
          </div>
          <div class="form-group">
            <label for="cloud-bin-id">JSONBin.io Bin ID</label>
            <input type="text" id="cloud-bin-id" name="binId" placeholder="e.g. 64abc123..." />
          </div>
          <div style="margin-bottom: var(--space-4); font-size: 11.5px; color: var(--text-muted); line-height: 1.5;">
            <strong>How to setup:</strong><br/>
            1. Go to <a href="https://jsonbin.io" target="_blank" style="color:var(--admin-accent)">JSONBin.io</a> and register a free account.<br/>
            2. Copy your <strong>API Key (X-Master-Key)</strong> and paste it above.<br/>
            3. In Settings, click <strong>Export Data</strong> to download your current data JSON.<br/>
            4. On JSONBin, click <strong>"Create Bin"</strong>, paste the content of your exported JSON, and save.<br/>
            5. Copy the generated <strong>Bin ID</strong>, paste it above, and click <strong>Enable Cloud Sync</strong>.
          </div>
          <button type="submit" class="admin-btn admin-btn-primary" id="save-cloud-sync-btn">Enable Cloud Sync</button>
        </form>
      </div>

      <div class="glass-card settings-card settings-danger">
        <h3>⚠️ Danger Zone</h3>
        <p>Reset all data to defaults. This action cannot be undone!</p>
        <button class="admin-btn admin-btn-danger" id="reset-data-btn">🗑️ Reset All Data</button>
      </div>
    </div>
  `;const e=5*1024*1024;let a=0;try{a=(localStorage.getItem("yuresh_portfolio_data")||"").length*2}catch{}const s=Math.min(100,Math.round(a/e*100)),n=(a/(1024*1024)).toFixed(2),o=(e/(1024*1024)).toFixed(2),i=document.getElementById("storage-usage-text"),d=document.getElementById("storage-usage-bar");i&&(i.textContent=`${n} MB / ${o} MB (${s}%)`),d&&(d.style.width=`${s}%`,s>85&&(d.style.background="var(--admin-red)")),document.getElementById("password-form").addEventListener("submit",g=>{g.preventDefault();const m=new FormData(g.target),k=m.get("currentPassword"),h=m.get("newPassword"),A=m.get("confirmPassword");if(!l.verifyPassword(k)){c("Current password is incorrect","error");return}if(h!==A){c("Passwords do not match","error");return}if(h.length<4){c("Password must be at least 4 characters","error");return}l.updatePassword(h),c("Password updated successfully!","success"),g.target.reset()}),document.getElementById("settings-export-btn").addEventListener("click",()=>{l.exportData(),c("Data exported!","success")}),document.getElementById("settings-import-btn").addEventListener("click",()=>{document.getElementById("import-file-input").click()}),document.getElementById("reset-data-btn").addEventListener("click",async()=>{await E("Reset All Data","This will delete all your portfolio data and reset to defaults. This cannot be undone. Are you absolutely sure?")&&(l.resetData(),c("All data has been reset to defaults","success"),w("personal"))});const p=l.getCloudConfig(),b=document.getElementById("cloud-api-key"),r=document.getElementById("cloud-bin-id"),f=document.getElementById("cloud-sync-form"),y=document.getElementById("save-cloud-sync-btn");b&&(b.value=p.apiKey||""),r&&(r.value=p.binId||""),y&&p.apiKey&&p.binId&&(y.textContent="🔄 Update Cloud Sync Settings"),f&&f.addEventListener("submit",g=>{g.preventDefault();const m=new FormData(f),k=m.get("apiKey").trim(),h=m.get("binId").trim();if(!k||!h){l.saveCloudConfig("",""),c("Cloud sync disabled. Using browser local storage.","info"),y&&(y.textContent="Enable Cloud Sync");return}if(l.saveCloudConfig(k,h)){c("Cloud database settings saved! Syncing now...","success"),y&&(y.textContent="🔄 Update Cloud Sync Settings");const _=l.loadData();l.syncToCloud(_).then(()=>{c("Data successfully pushed to cloud database!","success")}).catch(me=>{c("Failed to push data to cloud. Check API key/Bin ID.","error")})}else c("Failed to save settings.","error")})}function u(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}function B(){const t=document.getElementById("messages-list");if(!t)return;const e=D();if(I(),!e.length){t.innerHTML=`
      <div class="item-empty">
        <span class="item-empty-icon">📭</span>
        <p>No messages yet. When someone fills out the contact form, their messages appear here.</p>
      </div>`;return}t.innerHTML=e.map((s,n)=>`
    <div class="item-card msg-card${s.read?"":" msg-card--unread"}" data-msg-id="${s.id}" style="flex-direction:column;align-items:stretch;gap:10px;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">
          ${s.read?'<span style="width:8px;height:8px;flex-shrink:0"></span>':'<span style="width:8px;height:8px;border-radius:50%;background:var(--admin-accent);flex-shrink:0;box-shadow:0 0 6px var(--admin-accent)"></span>'}
          <div style="min-width:0;flex:1">
            <div class="item-title" style="font-size:14px">${u(s.name)} <span style="color:var(--text-muted);font-weight:400;font-size:12px">&lt;${u(s.email)}&gt;</span></div>
            <div class="item-subtitle">${u(s.subject||"(No subject)")}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
          <span style="font-size:11px;color:var(--text-muted)">${ue(s.date)}</span>
          <button class="admin-btn admin-btn-icon" onclick="deleteSingleMessage(${s.id})" title="Delete" style="color:var(--admin-red)">🗑</button>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:12px;font-size:13.5px;color:var(--text-secondary);line-height:1.6;white-space:pre-wrap">${u(s.message)}</div>
    </div>
  `).join("");const a=e.map(s=>({...s,read:!0}));localStorage.setItem("portfolio_messages",JSON.stringify(a)),I()}function D(){try{return JSON.parse(localStorage.getItem("portfolio_messages")||"[]")}catch{return[]}}function I(){const t=document.getElementById("sidebar-msg-badge");if(!t)return;const e=D().filter(a=>!a.read).length;e>0?(t.textContent=e,t.style.display="inline"):t.style.display="none"}function ue(t){try{const e=new Date(t);return e.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})+" "+e.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}catch{return t||""}}window.deleteSingleMessage=function(t){const e=D().filter(a=>a.id!==t);localStorage.setItem("portfolio_messages",JSON.stringify(e)),B()};window.adminClearMessages=async function(){await E("Clear All Messages","This will permanently delete all received messages. Are you sure?")&&(localStorage.removeItem("portfolio_messages"),B(),c("All messages cleared","success"))};
