-- Access-control test matrix for the six security findings closed in
-- drizzle/migrations/0002_close_six_security_findings.sql.
-- Runs as a privileged user, switches role/JWT claims per check, and ends by
-- raising an exception so EVERY change (fixtures included) is rolled back.
-- Output: the exception message is the PASS/FAIL report.
DO $test$
DECLARE
  tutor_a uuid := 'a54d78e1-15e2-48b3-b72d-ca998ee977ed';
  tutor_b uuid := 'bd335f03-dbab-4451-bab5-5d3acc17f333';
  student uuid := 'facac84e-e25e-43d6-aae9-ecc9fa90eb45';
  admin_u uuid := '87e84015-7542-4808-a797-eecce7826cc8';
  report text := '';
  passed int := 0; failed int := 0;
  n int; ok boolean; err text;
  c record;
BEGIN
  PERFORM set_config('storage.allow_delete_query', 'true', true);
  -- Fixtures
  INSERT INTO storage.objects(bucket_id, name) VALUES
    ('tutor-cvs', tutor_a || '/cv.pdf'), ('tutor-cvs', tutor_b || '/cv.pdf'),
    ('tutor-cvs', 'applications/2026/cv-test.pdf'),
    ('course-covers', 'teacher-avatars/' || tutor_b || '/b.png'),
    ('course-covers', 'cover-test.png');
  INSERT INTO public.teacher_availability(teacher_id, day_of_week, start_time, end_time, is_active)
    VALUES (tutor_b, 2, '10:00', '11:00', true);
  INSERT INTO public.bookings(student_id, teacher_id, scheduled_date, scheduled_time, status)
    VALUES (student, tutor_a, '2099-01-01', '10:00', 'completed');
  INSERT INTO public.teacher_reviews(teacher_id, student_id, rating, comment, status)
    VALUES (tutor_b, tutor_a, 5, 'approved-test', 'approved'),
           (tutor_b, admin_u, 1, 'rejected-test', 'rejected'),
           (tutor_b, student, 3, 'pending-test', 'pending');

  FOR c IN SELECT * FROM (VALUES
    -- who, expect, label, sql  (expect: ok = runs and touches >=1 row; deny = error or 0 rows)
    -- 1. teacher_availability
    ('anon','deny','F1 anon reads availability table','SELECT 1 FROM public.teacher_availability'),
    ('student','deny','F1 student reads availability table','SELECT 1 FROM public.teacher_availability'),
    ('tutor_a','deny','F1 tutor A reads tutor B availability rows','SELECT 1 FROM public.teacher_availability WHERE teacher_id = ''bd335f03-dbab-4451-bab5-5d3acc17f333'''),
    ('tutor_a','deny','F1 tutor A edits tutor B availability','UPDATE public.teacher_availability SET end_time=''12:00'' WHERE teacher_id=''bd335f03-dbab-4451-bab5-5d3acc17f333'''),
    ('tutor_a','deny','F1 tutor A deletes tutor B availability','DELETE FROM public.teacher_availability WHERE teacher_id=''bd335f03-dbab-4451-bab5-5d3acc17f333'''),
    ('tutor_a','deny','F1 tutor A inserts slot for tutor B','INSERT INTO public.teacher_availability(teacher_id,day_of_week,start_time,end_time) VALUES (''bd335f03-dbab-4451-bab5-5d3acc17f333'',3,''09:00'',''10:00'')'),
    ('tutor_b','ok','F1 tutor B reads own availability','SELECT 1 FROM public.teacher_availability WHERE teacher_id=''bd335f03-dbab-4451-bab5-5d3acc17f333'''),
    ('tutor_b','ok','F1 tutor B edits own availability','UPDATE public.teacher_availability SET end_time=''12:00'' WHERE teacher_id=''bd335f03-dbab-4451-bab5-5d3acc17f333'''),
    ('admin','ok','F1 admin edits any availability','UPDATE public.teacher_availability SET end_time=''12:30'' WHERE teacher_id=''bd335f03-dbab-4451-bab5-5d3acc17f333'''),
    ('anon','ok','F1 public profile gets verified tutor slots via RPC','SELECT 1 FROM public.get_public_teacher_availability(''bd335f03-dbab-4451-bab5-5d3acc17f333'')'),
    -- 2. teacher_reviews
    ('anon','deny','F2 anon reads reviews table','SELECT 1 FROM public.teacher_reviews'),
    ('tutor_b','deny','F2 other user reads raw reviews (student ids)','SELECT 1 FROM public.teacher_reviews'),
    ('anon','ok','F2 public RPC returns approved review','SELECT 1 FROM public.get_public_teacher_reviews(''bd335f03-dbab-4451-bab5-5d3acc17f333'') WHERE comment=''approved-test'''),
    ('anon','deny','F2 public RPC hides rejected review','SELECT 1 FROM public.get_public_teacher_reviews(''bd335f03-dbab-4451-bab5-5d3acc17f333'') WHERE comment=''rejected-test'''),
    ('student','ok','F2 student reviews tutor after completed session','INSERT INTO public.teacher_reviews(teacher_id,student_id,rating) VALUES (''a54d78e1-15e2-48b3-b72d-ca998ee977ed'',''facac84e-e25e-43d6-aae9-ecc9fa90eb45'',4)'),
    ('student','deny','F2 student reviews tutor without completed session','INSERT INTO public.teacher_reviews(teacher_id,student_id,rating) VALUES (''87e84015-7542-4808-a797-eecce7826cc8'',''facac84e-e25e-43d6-aae9-ecc9fa90eb45'',4)'),
    ('student','deny','F2 student self-approves (status forced to pending)',''),
    ('student','deny','F2 user edits another user''s review','UPDATE public.teacher_reviews SET comment=''x'' WHERE comment=''approved-test'''),
    ('student','deny','F2 student deletes review','DELETE FROM public.teacher_reviews WHERE comment=''approved-test'''),
    ('admin','ok','F2 admin moderates review','UPDATE public.teacher_reviews SET status=''approved'' WHERE comment=''rejected-test'''),
    -- 3. tutor-cvs (findings 3)
    ('anon','deny','F3 anon uploads CV','INSERT INTO storage.objects(bucket_id,name) VALUES (''tutor-cvs'',''x/anon.pdf'')'),
    ('anon','deny','F3 anon lists/reads CVs','SELECT 1 FROM storage.objects WHERE bucket_id=''tutor-cvs'''),
    ('anon','deny','F3 anon deletes CV','DELETE FROM storage.objects WHERE bucket_id=''tutor-cvs'''),
    ('student','deny','F3 student lists CVs','SELECT 1 FROM storage.objects WHERE bucket_id=''tutor-cvs'''),
    ('tutor_a','ok','F3 tutor A uploads into own folder','INSERT INTO storage.objects(bucket_id,name) VALUES (''tutor-cvs'',''a54d78e1-15e2-48b3-b72d-ca998ee977ed/new.pdf'')'),
    ('tutor_a','deny','F3 tutor A uploads non-allowed type','INSERT INTO storage.objects(bucket_id,name) VALUES (''tutor-cvs'',''a54d78e1-15e2-48b3-b72d-ca998ee977ed/evil.exe'')'),
    ('tutor_a','deny','F3 tutor A uploads into tutor B folder','INSERT INTO storage.objects(bucket_id,name) VALUES (''tutor-cvs'',''bd335f03-dbab-4451-bab5-5d3acc17f333/x.pdf'')'),
    ('tutor_a','ok','F3 tutor A reads own CV','SELECT 1 FROM storage.objects WHERE bucket_id=''tutor-cvs'' AND name=''a54d78e1-15e2-48b3-b72d-ca998ee977ed/cv.pdf'''),
    ('tutor_a','deny','F3 tutor A reads tutor B CV','SELECT 1 FROM storage.objects WHERE bucket_id=''tutor-cvs'' AND name LIKE ''bd335f03%'''),
    ('tutor_a','deny','F3 tutor A overwrites tutor B CV','UPDATE storage.objects SET metadata=''{}'' WHERE bucket_id=''tutor-cvs'' AND name LIKE ''bd335f03%'''),
    ('tutor_a','deny','F3 tutor A deletes tutor B CV','DELETE FROM storage.objects WHERE bucket_id=''tutor-cvs'' AND name LIKE ''bd335f03%'''),
    ('tutor_a','deny','F3 tutor A reads applicant uploads','SELECT 1 FROM storage.objects WHERE bucket_id=''tutor-cvs'' AND name LIKE ''applications/%'''),
    ('admin','ok','F3 admin reads applicant CV','SELECT 1 FROM storage.objects WHERE bucket_id=''tutor-cvs'' AND name LIKE ''applications/%'''),
    -- 4-6. course-covers
    ('anon','deny','F6 anon lists course-covers','SELECT 1 FROM storage.objects WHERE bucket_id=''course-covers'''),
    ('student','deny','F4 student uploads to course-covers','INSERT INTO storage.objects(bucket_id,name) VALUES (''course-covers'',''teacher-avatars/x.png'')'),
    ('tutor_a','ok','F4 tutor A uploads own avatar','INSERT INTO storage.objects(bucket_id,name) VALUES (''course-covers'',''teacher-avatars/a54d78e1-15e2-48b3-b72d-ca998ee977ed/a.png'')'),
    ('tutor_a','deny','F4 tutor A uploads into tutor B avatar folder','INSERT INTO storage.objects(bucket_id,name) VALUES (''course-covers'',''teacher-avatars/bd335f03-dbab-4451-bab5-5d3acc17f333/x.png'')'),
    ('tutor_a','deny','F4 tutor A uploads non-image','INSERT INTO storage.objects(bucket_id,name) VALUES (''course-covers'',''teacher-avatars/a54d78e1-15e2-48b3-b72d-ca998ee977ed/x.svg'')'),
    ('tutor_a','deny','F4 tutor A uploads a course cover','INSERT INTO storage.objects(bucket_id,name) VALUES (''course-covers'',''cover-a.png'')'),
    ('tutor_a','deny','F5 tutor A overwrites tutor B avatar','UPDATE storage.objects SET metadata=''{}'' WHERE bucket_id=''course-covers'' AND name LIKE ''teacher-avatars/bd335f03%'''),
    ('tutor_a','deny','F5 tutor A overwrites course cover','UPDATE storage.objects SET metadata=''{}'' WHERE bucket_id=''course-covers'' AND name=''cover-test.png'''),
    ('tutor_a','deny','F5 tutor A deletes tutor B avatar','DELETE FROM storage.objects WHERE bucket_id=''course-covers'' AND name LIKE ''teacher-avatars/bd335f03%'''),
    ('admin','ok','F4 admin uploads course cover','INSERT INTO storage.objects(bucket_id,name) VALUES (''course-covers'',''cover-admin.png'')'),
    ('admin','ok','F5 admin deletes course cover','DELETE FROM storage.objects WHERE bucket_id=''course-covers'' AND name=''cover-test.png''')
  ) AS t(who, expect, label, q) LOOP
    BEGIN
      PERFORM set_config('role', CASE WHEN c.who='anon' THEN 'anon' ELSE 'authenticated' END, true);
      PERFORM set_config('request.jwt.claims', CASE c.who
        WHEN 'anon' THEN '{"role":"anon"}'
        ELSE json_build_object('role','authenticated','sub', CASE c.who
          WHEN 'tutor_a' THEN tutor_a WHEN 'tutor_b' THEN tutor_b
          WHEN 'student' THEN student ELSE admin_u END)::text END, true);
      IF c.label LIKE 'F2 student self-approves%' THEN
        EXECUTE 'UPDATE public.teacher_reviews SET status=''approved'' WHERE comment=''pending-test''';
        PERFORM set_config('role', 'none', true);
        SELECT count(*) INTO n FROM public.teacher_reviews WHERE comment='pending-test' AND status='approved';
      ELSE
        EXECUTE c.q;
        GET DIAGNOSTICS n = ROW_COUNT;
      END IF;
      RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = '__rows:' || n;
    EXCEPTION WHEN OTHERS THEN
      err := SQLERRM;
      IF err LIKE '__rows:%' THEN
        n := substring(err from 8)::int;
        ok := (c.expect = 'ok' AND n > 0) OR (c.expect = 'deny' AND n = 0);
        err := n || ' rows';
      ELSE
        ok := (c.expect = 'deny');
      END IF;
    END;
    IF ok THEN passed := passed + 1; ELSE failed := failed + 1; END IF;
    report := report || E'\n' || CASE WHEN ok THEN 'PASS ' ELSE 'FAIL ' END || c.label || ' [' || left(err, 80) || ']';
  END LOOP;
  RAISE EXCEPTION 'RESULT passed=% failed=% %', passed, failed, report;
END
$test$;
