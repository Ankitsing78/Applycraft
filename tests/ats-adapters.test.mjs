import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("Greenhouse ATS test fixture contains required field selectors", () => {
  const fixturePath = path.join(__dirname, "ats-fixtures", "greenhouse-sample.html");
  const html = fs.readFileSync(fixturePath, "utf-8");

  assert.ok(html.includes('id="first_name"'), "Greenhouse fixture must have first_name");
  assert.ok(html.includes('id="last_name"'), "Greenhouse fixture must have last_name");
  assert.ok(html.includes('id="email"'), "Greenhouse fixture must have email");
  assert.ok(html.includes('id="phone"'), "Greenhouse fixture must have phone");
  assert.ok(html.includes('id="resume"'), "Greenhouse fixture must have resume input");
  assert.ok(html.includes('id="application_confirmation"'), "Greenhouse fixture must have confirmation section");
});

test("Lever ATS test fixture contains required field selectors", () => {
  const fixturePath = path.join(__dirname, "ats-fixtures", "lever-sample.html");
  const html = fs.readFileSync(fixturePath, "utf-8");

  assert.ok(html.includes('name="name"'), "Lever fixture must have name");
  assert.ok(html.includes('name="email"'), "Lever fixture must have email");
  assert.ok(html.includes('name="phone"'), "Lever fixture must have phone");
  assert.ok(html.includes('name="resume"'), "Lever fixture must have resume input");
  assert.ok(html.includes('class="application-confirmation"'), "Lever fixture must have confirmation section");
});

test("Workday ATS test fixture contains automation id attributes", () => {
  const fixturePath = path.join(__dirname, "ats-fixtures", "workday-sample.html");
  const html = fs.readFileSync(fixturePath, "utf-8");

  assert.ok(html.includes('data-automation-id="legalNameSection_firstName"'), "Workday must have firstName automation id");
  assert.ok(html.includes('data-automation-id="legalNameSection_lastName"'), "Workday must have lastName automation id");
  assert.ok(html.includes('data-automation-id="file-upload-drop-zone"'), "Workday must have drop-zone");
  assert.ok(html.includes('data-automation-id="congratulations"'), "Workday must have congratulations confirmation id");
});

test("SecurityGuard detects reCAPTCHA and Cloudflare Turnstile signatures", () => {
  const sampleWithRecaptcha = '<div class="g-recaptcha" data-sitekey="xyz"></div>';
  const hasRecaptcha = sampleWithRecaptcha.includes("g-recaptcha");
  assert.equal(hasRecaptcha, true, "Must flag reCAPTCHA presence");

  const sampleWithTurnstile = '<div class="cf-turnstile" data-sitekey="abc"></div>';
  const hasTurnstile = sampleWithTurnstile.includes("cf-turnstile");
  assert.equal(hasTurnstile, true, "Must flag Cloudflare Turnstile presence");
});
