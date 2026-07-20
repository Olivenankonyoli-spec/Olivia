-- Seed Data Script for Apex Tutor Hub
-- Run this in your Supabase SQL Editor AFTER running supabase_schema.sql
-- Note: You MUST have at least one admin or superadmin user created before running this script!

DO $$
DECLARE
  v_user_id UUID;
  v_c1 UUID; v_c2 UUID; v_c3 UUID; v_c4 UUID; v_c5 UUID; v_c6 UUID;
  v_l1 UUID; v_l2 UUID; v_l3 UUID; v_l4 UUID;
BEGIN
  -- Get the first admin or superadmin to own the seed data
  SELECT id INTO v_user_id FROM public.users WHERE role IN ('admin', 'superadmin') LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No admin or superadmin found. Please register an account and promote it to superadmin before running this script.';
  END IF;

  -- ==========================================
  -- 1. Courses
  -- ==========================================
  INSERT INTO public.courses (title, description, category, thumbnail_url, created_by) VALUES 
    ('Foundations of Calculus', 'Limits, derivatives, and integrals — built from first principles with clear visual intuition.', 'Mathematics', 'linear-gradient(135deg,#2563EB,#7C3AED)', v_user_id) RETURNING id INTO v_c1;
    
  INSERT INTO public.courses (title, description, category, thumbnail_url, created_by) VALUES 
    ('Modern Web Development', 'Build production-ready applications with React, TypeScript, and modern tooling.', 'Computer Science', 'linear-gradient(135deg,#14B8A6,#0EA5E9)', v_user_id) RETURNING id INTO v_c2;
    
  INSERT INTO public.courses (title, description, category, thumbnail_url, created_by) VALUES 
    ('Organic Chemistry I', 'Mechanisms, reactions, and stereochemistry for first-year university students.', 'Science', 'linear-gradient(135deg,#F59E0B,#EF4444)', v_user_id) RETURNING id INTO v_c3;
    
  INSERT INTO public.courses (title, description, category, thumbnail_url, created_by) VALUES 
    ('Introduction to Economics', 'Micro and macro foundations applied to real-world markets.', 'Business', 'linear-gradient(135deg,#10B981,#14B8A6)', v_user_id) RETURNING id INTO v_c4;
    
  INSERT INTO public.courses (title, description, category, thumbnail_url, created_by) VALUES 
    ('Creative Writing Workshop', 'Voice, structure, and craft for fiction and narrative non-fiction.', 'Humanities', 'linear-gradient(135deg,#6366F1,#EC4899)', v_user_id) RETURNING id INTO v_c5;
    
  INSERT INTO public.courses (title, description, category, thumbnail_url, created_by) VALUES 
    ('Data Structures & Algorithms', 'Master the patterns that power technical interviews and real systems.', 'Computer Science', 'linear-gradient(135deg,#0EA5E9,#2563EB)', v_user_id) RETURNING id INTO v_c6;

  -- ==========================================
  -- 2. Lessons (For Course 1 - Calculus)
  -- ==========================================
  INSERT INTO public.lessons (course_id, title, description, sort_order, published) VALUES
    (v_c1, 'Limits and Continuity', 'An intuitive approach to limits with worked examples.', 1, true) RETURNING id INTO v_l1;
    
  INSERT INTO public.lessons (course_id, title, description, sort_order, published) VALUES
    (v_c1, 'The Derivative', 'Definition, rules, and geometric meaning of the derivative.', 2, true) RETURNING id INTO v_l2;
    
  INSERT INTO public.lessons (course_id, title, description, sort_order, published) VALUES
    (v_c1, 'Applications of Differentiation', 'Optimization, related rates, and curve sketching.', 3, true) RETURNING id INTO v_l3;
    
  INSERT INTO public.lessons (course_id, title, description, sort_order, published) VALUES
    (v_c1, 'Integration Fundamentals', 'Antiderivatives and the fundamental theorem of calculus.', 4, true) RETURNING id INTO v_l4;

  -- ==========================================
  -- 3. Materials (For the Lessons)
  -- ==========================================
  INSERT INTO public.materials (lesson_id, title, file_url, size_bytes, uploaded_by) VALUES
    (v_l1, 'Lecture 1 — Limits.pdf', '#', 2400000, v_user_id),
    (v_l1, 'Worksheet 1.pdf', '#', 640000, v_user_id),
    (v_l2, 'Lecture 2 — Derivatives.pdf', '#', 3100000, v_user_id),
    (v_l3, 'Lecture 3 — Applications.pdf', '#', 2800000, v_user_id),
    (v_l3, 'Practice Set.pdf', '#', 1100000, v_user_id),
    (v_l4, 'Lecture 4 — Integration.pdf', '#', 2600000, v_user_id);

  -- ==========================================
  -- 4. Growth Data
  -- ==========================================
  INSERT INTO public.growth_data (month, students, courses) VALUES
    ('Jan', 220, 12), ('Feb', 310, 18), ('Mar', 480, 24), ('Apr', 612, 31),
    ('May', 790, 42), ('Jun', 980, 51), ('Jul', 1248, 64);

  -- ==========================================
  -- 5. Announcements
  -- ==========================================
  INSERT INTO public.announcements (title, body) VALUES
    ('Midterm schedule released', 'Check the materials tab in each course for the exam outline.'),
    ('New library additions', 'Six new lecture packs have been uploaded to your library.');

  -- ==========================================
  -- 6. Enrollments (Enroll the user in the first two courses)
  -- ==========================================
  INSERT INTO public.enrollments (user_id, course_id) VALUES 
    (v_user_id, v_c1),
    (v_user_id, v_c2);

END $$;
