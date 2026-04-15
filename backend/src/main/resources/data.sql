INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('modern', 'Modern', 'Clean and contemporary design with bold accents', 'professional', '["Two-column layout","Blue accent bar","Skills sidebar","ATS-friendly"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('minimal', 'Minimal', 'Simple and elegant single-column layout', 'simple', '["Single column","Black & white","Classic typography","Maximum whitespace"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('corporate', 'Corporate', 'Traditional professional layout for corporate environments', 'professional', '["Dark header bar","Left border accents","Single column","Conservative style"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('two-column', 'Two Column', 'Efficient two-column layout maximizing space', 'professional', '["Two-column layout","Skills sidebar","Compact design","Maximum content"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('creative', 'Creative', 'Bold creative design for design and marketing roles', 'creative', '["Purple gradient header","Colorful skill tags","Bold typography","Creative flair"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('tech', 'Tech', 'Clean technical layout optimized for software engineers', 'technical', '["Prominent links","Tech stack tags","Projects first","Monospace accents"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('gradient', 'Gradient', 'Vibrant indigo-to-pink gradient header with modern typography', 'creative', '["Gradient header","Pill-shaped tags","Two-column body","Gen Z vibes"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('sidebar', 'Sidebar', 'Dark navy sidebar with clean light content area', 'professional', '["Dark sidebar","Avatar initials","Sky-blue accents","Clean layout"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('executive', 'Executive', 'Premium serif layout with gold accents for senior professionals', 'professional', '["Serif typography","Gold accents","Centered header","Achievement-focused"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('emerald', 'Emerald', 'Canva-style wide teal sidebar with large avatar circle', 'creative', '["Teal gradient sidebar","Avatar circle","Pill skill tags","Canva-inspired"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('coral', 'Coral', 'Warm coral-orange full-width header with two-zone body', 'creative', '["Coral gradient header","Avatar initials","Orange date badges","Warm palette"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('noir', 'Noir', 'Dark slate header with rose accent for a bold, elegant look', 'professional', '["Dark slate header","Rose accents","Rounded avatar","Dot timeline"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('prisma', 'Prisma', 'Bold violet left panel with stacked info and clean white content area', 'creative', '["Violet sidebar","Large avatar","Pill skill tags","Two-zone layout"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('classic', 'Classic', 'Photo top-left, date-column layout with serif typography', 'professional', '["Profile photo","Date-column layout","Serif typography","4-col skills grid"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('sage', 'Sage', 'Olive-sage sidebar with full photo area, large display name, footer contact bar', 'creative', '["Photo sidebar","Large display name","Footer contact bar","Bullet skills"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('chronicle', 'Chronicle', 'Dark navy header with circular photo, gray sidebar, timeline dot experience', 'professional', '["Circular photo","Navy header","Gray sidebar","Timeline dots"]', true)
    ON CONFLICT (id) DO NOTHING;

INSERT INTO templates (id, name, description, category, features, active) VALUES
    ('slate', 'Slate', 'Gray rounded section bands, 3-column skills grid, clean infographic ATS style', 'simple', '["Gray section bands","3-col skills","Profile photo","ATS-friendly"]', true)
    ON CONFLICT (id) DO NOTHING;
