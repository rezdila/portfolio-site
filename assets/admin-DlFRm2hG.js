import{D as d,s as p,c as G,g as J,f as z}from"./utils-O7gnnfux.js";document.addEventListener("DOMContentLoaded",async()=>{await d.initCloud(),Q(),V(),Y(),W()});function Q(){const e=document.getElementById("password-screen"),t=document.getElementById("admin-app"),a=document.getElementById("admin-login-btn"),s=document.getElementById("admin-password"),n=document.getElementById("login-error");if(sessionStorage.getItem("admin_authenticated")==="true"){e.style.display="none",t.style.display="flex",$("personal"),setTimeout(E,100);return}a.addEventListener("click",()=>o()),s.addEventListener("keydown",i=>{i.key==="Enter"&&o()});function o(){const i=s.value;d.verifyPassword(i)?(sessionStorage.setItem("admin_authenticated","true"),e.style.display="none",t.style.display="flex",$("personal"),setTimeout(E,100)):(n.textContent="Incorrect password. Try again.",n.style.display="block",s.value="",s.classList.add("shake"),setTimeout(()=>s.classList.remove("shake"),500))}}let U="personal";function V(){const e=document.querySelectorAll(".admin-sidebar__link"),t=document.getElementById("admin-sidebar-toggle"),a=document.querySelector(".admin-sidebar");e.forEach(s=>{s.addEventListener("click",n=>{n.preventDefault();const o=s.dataset.section;o&&(e.forEach(i=>i.classList.remove("active")),e.forEach(i=>i.classList.remove("admin-sidebar__link--active")),s.classList.add("active"),s.classList.add("admin-sidebar__link--active"),$(o),a&&a.classList.remove("sidebar-open"))})}),t&&a&&t.addEventListener("click",()=>{a.classList.toggle("sidebar-open")})}function Y(){const e=document.getElementById("export-btn"),t=document.getElementById("import-btn"),a=document.getElementById("import-file-input"),s=document.getElementById("save-all-btn");e&&e.addEventListener("click",()=>{d.exportData(),p("Data exported successfully!","success")}),t&&a&&(t.addEventListener("click",()=>a.click()),a.addEventListener("change",async n=>{const o=n.target.files[0];if(o)try{await d.importData(o),p("Data imported successfully! Reloading...","success"),setTimeout(()=>{$(U)},1e3)}catch(i){p("Import failed: "+i.message,"error")}})),s&&s.addEventListener("click",()=>{p("All changes are auto-saved!","info")})}let x=null;function W(){const e=document.getElementById("admin-modal"),t=document.getElementById("modal-confirm-btn"),a=document.getElementById("modal-cancel-btn");t&&t.addEventListener("click",()=>{e&&e.classList.remove("is-open"),x&&x(!0)}),a&&a.addEventListener("click",()=>{e&&e.classList.remove("is-open"),x&&x(!1)})}function w(e,t){const a=document.getElementById("admin-modal"),s=document.getElementById("modal-title"),n=document.getElementById("modal-message");return s&&(s.textContent=e),n&&(n.textContent=t),a&&a.classList.add("is-open"),new Promise(o=>{x=o})}function $(e){U=e;const t=document.getElementById("admin-page-title"),a={personal:"👤 Personal Info",education:"🎓 Education",professionalQualifications:"🏆 Professional Qualifications",vocationalQualifications:"📜 Vocational Qualifications",experience:"💼 Experience",skills:"⚡ Skills",competencies:"🎯 Competencies",achievements:"🏅 Achievements",personality:"🧠 Personality",interests:"🎮 Interests & Hobbies",swot:"📊 SWOT Analysis",values:"✨ Values",goals:"🎯 Goals",gapAnalysis:"📈 Gap Analysis",actionPlan:"📋 Action Plan",projects:"🚀 Projects",messages:"📬 Messages Inbox",settings:"⚙️ Settings"};t&&(t.textContent=a[e]||e),document.querySelectorAll(".admin-section").forEach(i=>i.style.display="none");const s=document.getElementById(`section-${e}`);s&&(s.style.display="block");const o={personal:re,education:()=>v("education",X),professionalQualifications:()=>v("professionalQualifications",Z),vocationalQualifications:()=>v("vocationalQualifications",K),experience:()=>v("experience",ee),skills:()=>v("skills",te),competencies:()=>v("competencies",ae),achievements:()=>v("achievements",ne),personality:de,interests:()=>v("interests",se),swot:ce,values:()=>v("values",oe),goals:L,gapAnalysis:S,actionPlan:O,projects:()=>v("projects",ie),messages:B,settings:pe}[e];o&&o()}const X=[{key:"degree",label:"Degree / Certificate",type:"text",required:!0},{key:"institution",label:"Institution",type:"text",required:!0},{key:"year",label:"Year / Period",type:"text"},{key:"gpa",label:"GPA",type:"text"},{key:"description",label:"Description",type:"textarea"}],Z=[{key:"title",label:"Title",type:"text",required:!0},{key:"issuer",label:"Issuing Organization",type:"text"},{key:"date",label:"Date",type:"text"},{key:"description",label:"Description",type:"textarea"},{key:"credentialUrl",label:"Credential URL",type:"url"}],K=[{key:"title",label:"Title",type:"text",required:!0},{key:"issuer",label:"Issuing Organization",type:"text"},{key:"date",label:"Date",type:"text"},{key:"description",label:"Description",type:"textarea"}],ee=[{key:"role",label:"Role / Position",type:"text",required:!0},{key:"company",label:"Company / Organization",type:"text",required:!0},{key:"period",label:"Period",type:"text"},{key:"description",label:"Description",type:"textarea"},{key:"type",label:"Type",type:"select",options:["work","internship","volunteer","freelance"]}],te=[{key:"name",label:"Skill Name",type:"text",required:!0},{key:"level",label:"Proficiency Level (0-100)",type:"range",min:0,max:100},{key:"category",label:"Category",type:"text"}],ae=[{key:"name",label:"Competency Name",type:"text",required:!0},{key:"description",label:"Description",type:"textarea"}],ne=[{key:"title",label:"Achievement Title",type:"text",required:!0},{key:"description",label:"Description",type:"textarea"},{key:"date",label:"Date",type:"text"},{key:"category",label:"Category",type:"select",options:["Academic","Professional","Personal","Competition","Other"]}],se=[{key:"name",label:"Interest Name",type:"text",required:!0},{key:"icon",label:"Icon (emoji)",type:"text"},{key:"description",label:"Description",type:"textarea"}],oe=[{key:"name",label:"Value Name",type:"text",required:!0},{key:"description",label:"Description",type:"textarea"}],ie=[{key:"title",label:"Project Title",type:"text",required:!0},{key:"description",label:"Description",type:"textarea"},{key:"techStack",label:"Tech Stack (comma-separated)",type:"text"},{key:"liveUrl",label:"Live Demo URL",type:"url"},{key:"githubUrl",label:"GitHub URL",type:"url"},{key:"youtubeUrl",label:"YouTube URL",type:"url"},{key:"category",label:"Category",type:"text"},{key:"featured",label:"Featured",type:"checkbox"}];function re(){var o,i,r,l,b,m,g,y;const e=document.getElementById("section-personal");if(!e)return;const t=d.getSection("personal");e.innerHTML=`
    <form id="personal-form" class="admin-form">
      <div class="form-row">
        <div class="form-group">
          <label for="personal-fullName">Full Name</label>
          <input type="text" id="personal-fullName" name="fullName" value="${c(t.fullName||"")}" required />
        </div>
        <div class="form-group">
          <label for="personal-title">Professional Title</label>
          <input type="text" id="personal-title" name="title" value="${c(t.title||"")}" />
        </div>
      </div>

      <div class="form-group">
        <label for="personal-bio">Bio</label>
        <textarea id="personal-bio" name="bio" rows="4">${c(t.bio||"")}</textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="personal-email">Email</label>
          <input type="email" id="personal-email" name="email" value="${c(t.email||"")}" />
        </div>
        <div class="form-group">
          <label for="personal-location">Location</label>
          <input type="text" id="personal-location" name="location" value="${c(t.location||"")}" />
        </div>
      </div>

      <div class="form-group">
        <label>Profile Image</label>
        <div class="file-upload" id="profile-image-upload">
          ${t.profileImage?`<img src="${t.profileImage}" class="upload-preview" alt="Profile preview" />`:""}
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
          <input type="url" id="personal-linkedin" name="linkedin" value="${c(((o=t.socialLinks)==null?void 0:o.linkedin)||"")}" />
        </div>
        <div class="form-group">
          <label for="personal-github">GitHub URL</label>
          <input type="url" id="personal-github" name="github" value="${c(((i=t.socialLinks)==null?void 0:i.github)||"")}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="personal-facebook">Facebook URL</label>
          <input type="url" id="personal-facebook" name="facebook" value="${c(((r=t.socialLinks)==null?void 0:r.facebook)||"")}" />
        </div>
        <div class="form-group">
          <label for="personal-instagram">Instagram URL</label>
          <input type="url" id="personal-instagram" name="instagram" value="${c(((l=t.socialLinks)==null?void 0:l.instagram)||"")}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="personal-threads">Threads URL</label>
          <input type="url" id="personal-threads" name="threads" value="${c(((b=t.socialLinks)==null?void 0:b.threads)||"")}" />
        </div>
        <div class="form-group">
          <label for="personal-tiktok">TikTok URL</label>
          <input type="url" id="personal-tiktok" name="tiktok" value="${c(((m=t.socialLinks)==null?void 0:m.tiktok)||"")}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="personal-whatsapp">WhatsApp URL</label>
          <input type="url" id="personal-whatsapp" name="whatsapp" value="${c(((g=t.socialLinks)==null?void 0:g.whatsapp)||"")}" />
        </div>
        <div class="form-group">
          <label for="personal-website">Website URL</label>
          <input type="url" id="personal-website" name="website" value="${c(((y=t.socialLinks)==null?void 0:y.website)||"")}" />
        </div>
      </div>

      <button type="submit" class="admin-btn admin-btn-primary">💾 Save Personal Info</button>
    </form>
  `;const a=document.getElementById("personal-form");a.addEventListener("submit",f=>{f.preventDefault();const u=new FormData(a),k={...t,fullName:u.get("fullName"),title:u.get("title"),bio:u.get("bio"),email:u.get("email"),location:u.get("location"),socialLinks:{linkedin:u.get("linkedin"),github:u.get("github"),facebook:u.get("facebook"),instagram:u.get("instagram"),threads:u.get("threads"),tiktok:u.get("tiktok"),whatsapp:u.get("whatsapp"),website:u.get("website")}};d.updateSection("personal",k),p("Personal info saved!","success")});const s=document.getElementById("profile-image-upload"),n=document.getElementById("profile-image-input");s.addEventListener("click",()=>n.click()),s.addEventListener("dragover",f=>{f.preventDefault(),s.classList.add("drag-over")}),s.addEventListener("dragleave",()=>{s.classList.remove("drag-over")}),s.addEventListener("drop",f=>{f.preventDefault(),s.classList.remove("drag-over");const u=f.dataTransfer.files[0];u&&P(u,t)}),n.addEventListener("change",f=>{const u=f.target.files[0];u&&P(u,t)})}async function P(e,t){try{const a=await G(e,800,.75);t.profileImage=a,d.updateSection("personal",t);const s=document.querySelector(".upload-preview"),n=document.getElementById("profile-image-upload");if(s)s.src=a;else{const o=document.createElement("img");o.src=a,o.className="upload-preview",o.alt="Profile preview",n.insertBefore(o,n.firstChild)}p("Profile image updated!","success")}catch(a){p(`Failed to update profile image: ${a.message}`,"error")}}function v(e,t){const a=document.getElementById(`section-${e}`);if(!a)return;const s=d.getSection(e),n=Array.isArray(s)?s:[],o=!["skills","competencies","interests","values"].includes(e);a.innerHTML=`
    <div class="admin-list-header">
      <span class="item-count">${n.length} item${n.length!==1?"s":""}</span>
      <button class="admin-btn admin-btn-primary" id="add-${e}-btn">+ Add New</button>
    </div>
    <div class="item-list" id="${e}-list">
      ${n.map(i=>le(e,i,t)).join("")}
    </div>
    <div id="${e}-form-container" style="display:none;"></div>
  `,document.getElementById(`add-${e}-btn`).addEventListener("click",()=>{T(e,null,t,o)}),a.querySelectorAll(".item-edit-btn").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.id,l=n.find(b=>b.id===r);l&&T(e,l,t,o)})}),a.querySelectorAll(".item-delete-btn").forEach(i=>{i.addEventListener("click",async()=>{const r=i.dataset.id;await w("Delete Item","Are you sure you want to delete this item? This cannot be undone.")&&(d.deleteItem(e,r),v(e,t),p("Item deleted","success"))})})}function le(e,t,a){const s=a[0],n=a.length>1?a[1]:null,o=t[s.key]||"Untitled",i=n&&t[n.key]||"";let r=o;Array.isArray(o)&&(r=o.join(", "));let l=i;Array.isArray(i)&&(l=i.join(", "));const b=t.level!==void 0?`<div class="item-level-bar"><div class="item-level-fill" style="width:${t.level}%"></div><span>${t.level}%</span></div>`:"",m=t.proofs?t.proofs.length:0,g=m>0?`<span class="item-proofs-badge">📎 ${m} proof${m>1?"s":""}</span>`:"";return`
    <div class="item-card glass-card">
      <div class="item-info">
        <h4 class="item-title">${c(String(r))}</h4>
        <p class="item-subtitle">${c(String(l))}</p>
        ${b}
        ${g}
      </div>
      <div class="item-actions">
        <button class="admin-btn admin-btn-small item-edit-btn" data-id="${t.id}">✏️ Edit</button>
        <button class="admin-btn admin-btn-small admin-btn-danger item-delete-btn" data-id="${t.id}">🗑️ Delete</button>
      </div>
    </div>
  `}function T(e,t,a,s){const n=document.getElementById(`${e}-form-container`);if(!n)return;const o=!!t,i=e;n.style.display="block",n.innerHTML=`
    <div class="admin-item-form glass-card">
      <h3>${o?"Edit":"Add New"} Item</h3>
      <form id="${i}-item-form">
        ${a.map(l=>j(l,t)).join("")}
        ${s?H(t):""}
        <div class="form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">💾 ${o?"Save Changes":"Add Item"}</button>
          <button type="button" class="admin-btn admin-btn-secondary" id="${i}-cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  `,n.scrollIntoView({behavior:"smooth",block:"center"}),document.getElementById(`${i}-cancel-btn`).addEventListener("click",()=>{n.style.display="none",n.innerHTML=""});const r=document.getElementById(`${i}-item-form`);r.addEventListener("submit",l=>{l.preventDefault();const b=new FormData(r),m={};a.forEach(g=>{let y=b.get(g.key);g.type==="checkbox"?y=r.querySelector(`[name="${g.key}"]`).checked:g.type==="range"?y=parseInt(y)||0:g.key==="techStack"&&(y=y?y.split(",").map(f=>f.trim()).filter(Boolean):[]),m[g.key]=y||""}),o?(m.id=t.id,m.proofs=t.proofs||[],d.updateItem(e,t.id,m),p("Item updated!","success")):(m.id=d.generateId(e.substring(0,3)),m.proofs=[],d.addItem(e,m),p("Item added!","success")),n.style.display="none",n.innerHTML="",v(e,a)}),s&&R(e,t)}function j(e,t){const a=t?t[e.key]||"":e.default||"",s=Array.isArray(a)?a.join(", "):a,n=e.required?"required":"";switch(e.type){case"textarea":return`
        <div class="form-group">
          <label for="field-${e.key}">${e.label}</label>
          <textarea id="field-${e.key}" name="${e.key}" rows="3" ${n}>${c(String(s))}</textarea>
        </div>
      `;case"select":return`
        <div class="form-group">
          <label for="field-${e.key}">${e.label}</label>
          <select id="field-${e.key}" name="${e.key}" ${n}>
            ${(e.options||[]).map(o=>`<option value="${o}" ${a===o?"selected":""}>${o.charAt(0).toUpperCase()+o.slice(1)}</option>`).join("")}
          </select>
        </div>
      `;case"range":return`
        <div class="form-group">
          <label for="field-${e.key}">${e.label}: <span id="range-value-${e.key}">${a||50}</span>%</label>
          <input type="range" id="field-${e.key}" name="${e.key}" min="${e.min||0}" max="${e.max||100}" value="${a||50}" 
            oninput="document.getElementById('range-value-${e.key}').textContent = this.value" />
        </div>
      `;case"checkbox":return`
        <div class="form-group form-group-checkbox">
          <label>
            <input type="checkbox" id="field-${e.key}" name="${e.key}" ${a?"checked":""} />
            ${e.label}
          </label>
        </div>
      `;default:return`
        <div class="form-group">
          <label for="field-${e.key}">${e.label}</label>
          <input type="${e.type||"text"}" id="field-${e.key}" name="${e.key}" value="${c(String(s))}" ${n} />
        </div>
      `}}function H(e){return`
    <div class="proof-upload-section">
      <h4>Proof Attachments</h4>
      <div class="proof-list" id="proof-list">
        ${((e==null?void 0:e.proofs)||[]).map((a,s)=>`
          <div class="proof-upload-item">
            <span class="proof-upload-icon">${a.type==="image"?"🖼️":a.type==="pdf"?"📄":a.type==="youtube"?"▶️":"🎥"}</span>
            <span class="proof-upload-name">${c(a.name||"Proof")}</span>
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
        <div class="form-group" style="margin-top: 0.5rem;">
          <label for="youtube-proof-url">Or add YouTube URL:</label>
          <div class="input-with-btn">
            <input type="url" id="youtube-proof-url" placeholder="https://youtube.com/watch?v=..." />
            <button type="button" class="admin-btn admin-btn-small" id="add-youtube-proof-btn">Add</button>
          </div>
        </div>
      </div>
    </div>
  `}function R(e,t){if(!t)return;const a=document.getElementById("proof-drop-area"),s=document.getElementById("proof-file-input"),n=document.getElementById("youtube-proof-url"),o=document.getElementById("add-youtube-proof-btn");a&&s&&(a.addEventListener("click",()=>s.click()),a.addEventListener("dragover",r=>{r.preventDefault(),a.classList.add("drag-over")}),a.addEventListener("dragleave",()=>a.classList.remove("drag-over")),a.addEventListener("drop",r=>{r.preventDefault(),a.classList.remove("drag-over"),C(r.dataTransfer.files,e,t)}),s.addEventListener("change",r=>{C(r.target.files,e,t)})),o&&n&&o.addEventListener("click",()=>{const r=n.value.trim();if(r){const l={type:"youtube",url:r,name:"YouTube Video"};d.addProof(e,t.id,l),t.proofs=t.proofs||[],t.proofs.push(l),n.value="",p("YouTube proof added!","success"),I(t)}});const i=document.getElementById("proof-list");i&&i.addEventListener("click",r=>{const l=r.target.closest(".proof-remove-btn");if(l){const b=parseInt(l.dataset.index);d.removeProof(e,t.id,b),t.proofs.splice(b,1),I(t),p("Proof removed","success")}})}async function C(e,t,a){for(const n of e){if(n.size>1572864){p(`Failed to upload ${n.name}: File is too large. Please use files under 1.5 MB.`,"error");continue}try{const o=J(n.name);let i;o==="image"?i=await G(n,1200,.75):i=await z(n);const r={type:o,url:i,name:n.name};if(!d.addProof(t,a.id,r)){p(`Failed to upload ${n.name}: Storage limit reached. Try clearing old files.`,"error");continue}a.proofs=a.proofs||[],a.proofs.push(r),p(`Proof "${n.name}" uploaded!`,"success")}catch(o){p(`Failed to upload ${n.name}: ${o.message}`,"error")}}I(a)}function I(e){const t=document.getElementById("proof-list");if(!t)return;const a=e.proofs||[];t.innerHTML=a.map((s,n)=>`
    <div class="proof-upload-item">
      <span class="proof-upload-icon">${s.type==="image"?"🖼️":s.type==="pdf"?"📄":s.type==="youtube"?"▶️":"🎥"}</span>
      <span class="proof-upload-name">${c(s.name||"Proof")}</span>
      <button type="button" class="admin-btn admin-btn-small admin-btn-danger proof-remove-btn" data-index="${n}">✕</button>
    </div>
  `).join("")}function de(){const e=document.getElementById("section-personality");if(!e)return;const t=d.getSection("personality");e.innerHTML=`
    <form id="personality-form" class="admin-form">
      <div class="form-row">
        <div class="form-group">
          <label for="mbti-type">MBTI Type</label>
          <input type="text" id="mbti-type" name="mbtiType" value="${c(t.mbtiType||"")}" maxlength="4" placeholder="e.g., INTJ" />
        </div>
        <div class="form-group">
          <label for="mbti-label">MBTI Label</label>
          <input type="text" id="mbti-label" name="mbtiLabel" value="${c(t.mbtiLabel||"")}" placeholder="e.g., Architect" />
        </div>
      </div>
      <div class="form-group">
        <label for="mbti-description">MBTI Description</label>
        <textarea id="mbti-description" name="mbtiDescription" rows="3">${c(t.mbtiDescription||"")}</textarea>
      </div>
      <div class="form-group">
        <label for="career-key">Career Key Results</label>
        <textarea id="career-key" name="careerKeyResults" rows="3">${c(t.careerKeyResults||"")}</textarea>
      </div>

      ${H({proofs:t.proofs||[]})}

      <button type="submit" class="admin-btn admin-btn-primary">💾 Save Personality</button>
    </form>
  `,R("personality",t);const a=document.getElementById("personality-form");a.addEventListener("submit",s=>{s.preventDefault();const n=new FormData(a),o={...t,mbtiType:n.get("mbtiType"),mbtiLabel:n.get("mbtiLabel"),mbtiDescription:n.get("mbtiDescription"),careerKeyResults:n.get("careerKeyResults")};d.updateSection("personality",o),p("Personality info saved!","success")})}function ce(){const e=document.getElementById("section-swot");if(!e)return;const t=d.getSection("swot"),a=[{key:"strengths",label:"💪 Strengths",color:"cyan"},{key:"weaknesses",label:"⚠️ Weaknesses",color:"pink"},{key:"opportunities",label:"🚀 Opportunities",color:"emerald"},{key:"threats",label:"🔥 Threats",color:"amber"}];e.innerHTML=`
    <form id="swot-form" class="admin-form">
      <div class="swot-form-grid">
        ${a.map(n=>`
          <div class="swot-form-quadrant swot-form-${n.color}">
            <h4>${n.label}</h4>
            <div class="swot-items" id="swot-${n.key}-items">
              ${(t[n.key]||[]).map((o,i)=>`
                <div class="swot-form-item">
                  <input type="text" name="${n.key}-${i}" value="${c(o)}" />
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
  `,e.querySelectorAll(".swot-add").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.quadrant,i=document.getElementById(`swot-${o}-items`),r=i.children.length,l=document.createElement("div");l.className="swot-form-item",l.innerHTML=`
        <input type="text" name="${o}-${r}" placeholder="Enter item..." />
        <button type="button" class="admin-btn admin-btn-small admin-btn-danger swot-remove" data-quadrant="${o}" data-index="${r}">✕</button>
      `,i.appendChild(l),l.querySelector("input").focus()})}),e.addEventListener("click",n=>{n.target.classList.contains("swot-remove")&&n.target.closest(".swot-form-item").remove()});const s=document.getElementById("swot-form");s.addEventListener("submit",n=>{n.preventDefault();const o={};a.forEach(i=>{const r=[];s.querySelectorAll(`[name^="${i.key}-"]`).forEach(b=>{const m=b.value.trim();m&&r.push(m)}),o[i.key]=r}),d.updateSection("swot",o),p("SWOT Analysis saved!","success")})}function L(){const e=document.getElementById("section-goals");if(!e)return;const t=d.getSection("goals");let a="smart";function s(n){return`
      <div class="item-list">
        ${(t[n]||[]).map(i=>`
          <div class="item-card glass-card">
            <div class="item-info">
              <h4 class="item-title">${c(i.title)}</h4>
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
    `}e.innerHTML=`
    <div class="admin-tabs">
      <button class="tab-btn active" data-tab="smart">SMART Goals</button>
      <button class="tab-btn" data-tab="safe">SAFE Goals</button>
    </div>
    <div id="goals-tab-content">
      ${s("smart")}
    </div>
  `,e.querySelectorAll(".tab-btn").forEach(n=>{n.addEventListener("click",()=>{e.querySelectorAll(".tab-btn").forEach(o=>o.classList.remove("active")),n.classList.add("active"),a=n.dataset.tab,document.getElementById("goals-tab-content").innerHTML=s(a),F(e,t)})}),F(e,t)}function F(e,t){e.querySelectorAll(".goal-add-btn").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.type;M(s,null,t)})}),e.querySelectorAll(".goal-edit-btn").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.type,n=a.dataset.id,o=t[s].find(i=>i.id===n);o&&M(s,o,t)})}),e.querySelectorAll(".goal-delete-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.type,n=a.dataset.id;await w("Delete Goal","Are you sure?")&&(t[s]=t[s].filter(i=>i.id!==n),d.updateSection("goals",t),L(),p("Goal deleted","success"))})})}function M(e,t,a){const s=document.getElementById(`goal-form-container-${e}`);if(!s)return;const n=!!t,o=e==="smart"?[{key:"title",label:"Goal Title",type:"text"},{key:"specific",label:"Specific",type:"textarea"},{key:"measurable",label:"Measurable",type:"textarea"},{key:"achievable",label:"Achievable",type:"textarea"},{key:"relevant",label:"Relevant",type:"textarea"},{key:"timeBound",label:"Time-Bound",type:"textarea"},{key:"progress",label:"Progress (%)",type:"range",min:0,max:100},{key:"status",label:"Status",type:"select",options:["not-started","in-progress","completed","on-hold"]}]:[{key:"title",label:"Goal Title",type:"text"},{key:"stretch",label:"Stretch",type:"textarea"},{key:"ambitious",label:"Ambitious",type:"textarea"},{key:"flexible",label:"Flexible",type:"textarea"},{key:"everyday",label:"Everyday",type:"textarea"},{key:"progress",label:"Progress (%)",type:"range",min:0,max:100},{key:"status",label:"Status",type:"select",options:["not-started","in-progress","completed","on-hold"]}];s.style.display="block",s.innerHTML=`
    <div class="admin-item-form glass-card">
      <h3>${n?"Edit":"Add"} ${e.toUpperCase()} Goal</h3>
      <form id="goal-edit-form">
        ${o.map(i=>j(i,t)).join("")}
        <div class="form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">💾 Save</button>
          <button type="button" class="admin-btn admin-btn-secondary" id="goal-cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  `,document.getElementById("goal-cancel-btn").addEventListener("click",()=>{s.style.display="none"}),document.getElementById("goal-edit-form").addEventListener("submit",i=>{i.preventDefault();const r=new FormData(i.target),l={};if(o.forEach(b=>{let m=r.get(b.key);b.type==="range"&&(m=parseInt(m)||0),l[b.key]=m||""}),n){l.id=t.id;const b=a[e].findIndex(m=>m.id===t.id);b>=0&&(a[e][b]=l)}else l.id=d.generateId(e),a[e]=a[e]||[],a[e].push(l);d.updateSection("goals",a),L(),p(`Goal ${n?"updated":"added"}!`,"success")})}function S(){const e=document.getElementById("section-gapAnalysis");if(!e)return;const t=d.getSection("gapAnalysis");let a="knowledge";function s(n){return`
      <div class="item-list">
        ${(t[n]||[]).map(i=>`
          <div class="item-card glass-card">
            <div class="item-info">
              <h4 class="item-title">${c(i.current)} → ${c(i.required)}</h4>
              <p class="item-subtitle">Gap: ${c(i.gap)}</p>
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
    `}e.innerHTML=`
    <div class="admin-tabs">
      <button class="tab-btn active" data-tab="knowledge">Knowledge</button>
      <button class="tab-btn" data-tab="skills">Skills</button>
      <button class="tab-btn" data-tab="experience">Experience</button>
    </div>
    <div id="gap-tab-content">${s("knowledge")}</div>
  `,e.querySelectorAll(".tab-btn").forEach(n=>{n.addEventListener("click",()=>{e.querySelectorAll(".tab-btn").forEach(o=>o.classList.remove("active")),n.classList.add("active"),a=n.dataset.tab,document.getElementById("gap-tab-content").innerHTML=s(a),q(e,t)})}),q(e,t)}function q(e,t){e.querySelectorAll(".gap-add-btn").forEach(a=>{a.addEventListener("click",()=>N(a.dataset.type,null,t))}),e.querySelectorAll(".gap-edit-btn").forEach(a=>{var o;const s=a.dataset.type,n=(o=t[s])==null?void 0:o.find(i=>i.id===a.dataset.id);n&&a.addEventListener("click",()=>N(s,n,t))}),e.querySelectorAll(".gap-delete-btn").forEach(a=>{a.addEventListener("click",async()=>{if(await w("Delete","Delete this gap item?")){const n=a.dataset.type;t[n]=t[n].filter(o=>o.id!==a.dataset.id),d.updateSection("gapAnalysis",t),S(),p("Deleted","success")}})})}function N(e,t,a){const s=document.getElementById(`gap-form-container-${e}`);if(!s)return;const n=!!t;s.style.display="block",s.innerHTML=`
    <div class="admin-item-form glass-card">
      <form id="gap-edit-form">
        <div class="form-group"><label>Current State</label><textarea name="current" rows="2">${c((t==null?void 0:t.current)||"")}</textarea></div>
        <div class="form-group"><label>Required State</label><textarea name="required" rows="2">${c((t==null?void 0:t.required)||"")}</textarea></div>
        <div class="form-group"><label>Gap</label><textarea name="gap" rows="2">${c((t==null?void 0:t.gap)||"")}</textarea></div>
        <div class="form-group"><label>Action Plan</label><textarea name="plan" rows="2">${c((t==null?void 0:t.plan)||"")}</textarea></div>
        <div class="form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">💾 Save</button>
          <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.admin-item-form').parentElement.style.display='none'">Cancel</button>
        </div>
      </form>
    </div>
  `,document.getElementById("gap-edit-form").addEventListener("submit",o=>{o.preventDefault();const i=new FormData(o.target),r={current:i.get("current"),required:i.get("required"),gap:i.get("gap"),plan:i.get("plan")};if(n){r.id=t.id;const l=a[e].findIndex(b=>b.id===t.id);l>=0&&(a[e][l]=r)}else r.id=d.generateId("gap"),a[e]=a[e]||[],a[e].push(r);d.updateSection("gapAnalysis",a),S(),p("Saved!","success")})}function O(){const e=document.getElementById("section-actionPlan");if(!e)return;const t=d.getSection("actionPlan");e.innerHTML=`
    <form id="action-plan-form" class="admin-form">
      ${t.map((a,s)=>`
        <div class="action-plan-year-form glass-card">
          <div class="form-row">
            <div class="form-group">
              <label>Year Label</label>
              <input type="text" name="year-${s}" value="${c(a.year)}" />
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
  `,document.getElementById("add-year-btn").addEventListener("click",()=>{t.push({id:d.generateId("ap"),year:`Year ${t.length+1}`,goals:[],status:"not-started"}),d.updateSection("actionPlan",t),O()}),document.getElementById("action-plan-form").addEventListener("submit",a=>{a.preventDefault();const s=new FormData(a.target);t.forEach((n,o)=>{n.year=s.get(`year-${o}`)||n.year,n.status=s.get(`status-${o}`)||n.status;const i=s.get(`goals-${o}`)||"";n.goals=i.split(`
`).map(r=>r.trim()).filter(Boolean)}),d.updateSection("actionPlan",t),p("Action Plan saved!","success")})}function pe(){const e=document.getElementById("section-settings");if(!e)return;e.innerHTML=`
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
  `;const t=5*1024*1024;let a=0;try{a=(localStorage.getItem("yuresh_portfolio_data")||"").length*2}catch{}const s=Math.min(100,Math.round(a/t*100)),n=(a/(1024*1024)).toFixed(2),o=(t/(1024*1024)).toFixed(2),i=document.getElementById("storage-usage-text"),r=document.getElementById("storage-usage-bar");i&&(i.textContent=`${n} MB / ${o} MB (${s}%)`),r&&(r.style.width=`${s}%`,s>85&&(r.style.background="var(--admin-red)")),document.getElementById("password-form").addEventListener("submit",f=>{f.preventDefault();const u=new FormData(f.target),k=u.get("currentPassword"),h=u.get("newPassword"),A=u.get("confirmPassword");if(!d.verifyPassword(k)){p("Current password is incorrect","error");return}if(h!==A){p("Passwords do not match","error");return}if(h.length<4){p("Password must be at least 4 characters","error");return}d.updatePassword(h),p("Password updated successfully!","success"),f.target.reset()}),document.getElementById("settings-export-btn").addEventListener("click",()=>{d.exportData(),p("Data exported!","success")}),document.getElementById("settings-import-btn").addEventListener("click",()=>{document.getElementById("import-file-input").click()}),document.getElementById("reset-data-btn").addEventListener("click",async()=>{await w("Reset All Data","This will delete all your portfolio data and reset to defaults. This cannot be undone. Are you absolutely sure?")&&(d.resetData(),p("All data has been reset to defaults","success"),$("personal"))});const l=d.getCloudConfig(),b=document.getElementById("cloud-api-key"),m=document.getElementById("cloud-bin-id"),g=document.getElementById("cloud-sync-form"),y=document.getElementById("save-cloud-sync-btn");b&&(b.value=l.apiKey||""),m&&(m.value=l.binId||""),y&&l.apiKey&&l.binId&&(y.textContent="🔄 Update Cloud Sync Settings"),g&&g.addEventListener("submit",f=>{f.preventDefault();const u=new FormData(g),k=u.get("apiKey").trim(),h=u.get("binId").trim();if(!k||!h){d.saveCloudConfig("",""),p("Cloud sync disabled. Using browser local storage.","info"),y&&(y.textContent="Enable Cloud Sync");return}if(d.saveCloudConfig(k,h)){p("Cloud database settings saved! Syncing now...","success"),y&&(y.textContent="🔄 Update Cloud Sync Settings");const _=d.loadData();d.syncToCloud(_).then(()=>{p("Data successfully pushed to cloud database!","success")}).catch(me=>{p("Failed to push data to cloud. Check API key/Bin ID.","error")})}else p("Failed to save settings.","error")})}function c(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function B(){const e=document.getElementById("messages-list");if(!e)return;const t=D();if(E(),!t.length){e.innerHTML=`
      <div class="item-empty">
        <span class="item-empty-icon">📭</span>
        <p>No messages yet. When someone fills out the contact form, their messages appear here.</p>
      </div>`;return}e.innerHTML=t.map((s,n)=>`
    <div class="item-card msg-card${s.read?"":" msg-card--unread"}" data-msg-id="${s.id}" style="flex-direction:column;align-items:stretch;gap:10px;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">
          ${s.read?'<span style="width:8px;height:8px;flex-shrink:0"></span>':'<span style="width:8px;height:8px;border-radius:50%;background:var(--admin-accent);flex-shrink:0;box-shadow:0 0 6px var(--admin-accent)"></span>'}
          <div style="min-width:0;flex:1">
            <div class="item-title" style="font-size:14px">${c(s.name)} <span style="color:var(--text-muted);font-weight:400;font-size:12px">&lt;${c(s.email)}&gt;</span></div>
            <div class="item-subtitle">${c(s.subject||"(No subject)")}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
          <span style="font-size:11px;color:var(--text-muted)">${ue(s.date)}</span>
          <button class="admin-btn admin-btn-icon" onclick="deleteSingleMessage(${s.id})" title="Delete" style="color:var(--admin-red)">🗑</button>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:12px;font-size:13.5px;color:var(--text-secondary);line-height:1.6;white-space:pre-wrap">${c(s.message)}</div>
    </div>
  `).join("");const a=t.map(s=>({...s,read:!0}));localStorage.setItem("portfolio_messages",JSON.stringify(a)),E()}function D(){try{return JSON.parse(localStorage.getItem("portfolio_messages")||"[]")}catch{return[]}}function E(){const e=document.getElementById("sidebar-msg-badge");if(!e)return;const t=D().filter(a=>!a.read).length;t>0?(e.textContent=t,e.style.display="inline"):e.style.display="none"}function ue(e){try{const t=new Date(e);return t.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})+" "+t.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}catch{return e||""}}window.deleteSingleMessage=function(e){const t=D().filter(a=>a.id!==e);localStorage.setItem("portfolio_messages",JSON.stringify(t)),B()};window.adminClearMessages=async function(){await w("Clear All Messages","This will permanently delete all received messages. Are you sure?")&&(localStorage.removeItem("portfolio_messages"),B(),p("All messages cleared","success"))};
