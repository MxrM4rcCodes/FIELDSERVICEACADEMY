export interface ScenarioSeedChoice {
  choiceKey: string;
  text: string;
  targetNodeKey: string;
  testRevealedEvidence?: string;
  pointsSafety: number;
  pointsDiagnostic: number;
  pointsCost: number;
  feedback: string;
  sortOrder: number;
}

export interface ScenarioSeedNode {
  nodeKey: string;
  title: string;
  description: string;
  nodeType: string;
  isTerminal: boolean;
  isHazardous: boolean;
  choices: ScenarioSeedChoice[];
}

export interface ScenarioSeed {
  scenarioNumber: number;
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  customerComplaint: string;
  equipmentContext: string;
  recentChanges: string;
  hiddenRootCause: string;
  initialNodeKey: string;
  verificationCriteria: string;
  nodes: ScenarioSeedNode[];
}

type Score = { safety?: number; diagnostic?: number; cost?: number; evidence?: string };
function choice(
  choiceKey: string,
  text: string,
  targetNodeKey: string,
  feedback: string,
  score: Score = {},
  sortOrder = 1,
): ScenarioSeedChoice {
  return {
    choiceKey,
    text,
    targetNodeKey,
    feedback,
    testRevealedEvidence: score.evidence,
    pointsSafety: score.safety ?? 0,
    pointsDiagnostic: score.diagnostic ?? 0,
    pointsCost: score.cost ?? 0,
    sortOrder,
  };
}

function node(
  nodeKey: string,
  title: string,
  description: string,
  nodeType: string,
  choices: ScenarioSeedChoice[] = [],
  isTerminal = false,
  isHazardous = false,
): ScenarioSeedNode {
  return { nodeKey, title, description, nodeType, choices, isTerminal, isHazardous };
}

const success = (key: string, title: string, description: string) =>
  node(key, title, description, "terminal_success", [], true, false);
const fail = (key: string, title: string, description: string, hazardous = false) =>
  node(key, title, description, "terminal_fail", [], true, hazardous);

function scenario(
  scenarioNumber: number,
  title: string,
  slug: string,
  category: string,
  difficulty: string,
  customerComplaint: string,
  recentChanges: string,
  learningPoint: string,
  verificationCriteria: string,
  nodes: ScenarioSeedNode[],
): ScenarioSeed {
  return {
    scenarioNumber,
    title,
    slug,
    category,
    difficulty,
    customerComplaint,
    equipmentContext: "Simulated training case. Exact manufacturer, model, configuration, and procedures are intentionally unspecified; consult the current documentation for real equipment.",
    recentChanges,
    hiddenRootCause: learningPoint,
    initialNodeKey: "start",
    verificationCriteria,
    nodes,
  };
}

export const seedScenarios: ScenarioSeed[] = [
  scenario(
    1,
    "Horizontal Banding: Build a Hypothesis Before Acting",
    "case-01-banding-missing-nozzles",
    "Print-quality diagnosis",
    "basic",
    "“I see horizontal lines on this job. We changed the material last week, but the operator thinks the printhead is failing.”",
    "Material and job details have not yet been compared with an approved reference.",
    "The visual pattern is not sufficient to select one root cause. Compare the source, material, settings, and approved diagnostic evidence; a nozzle pattern is informative but limited to its test conditions.",
    "Complete the exercise by documenting a safe, approved comparison and an outcome checked against the customer's defined target. Do not claim that a repair occurred.",
    [
      node("start", "Clarify the complaint", "The customer points to horizontal bands but has not identified whether they appear on every job, material, or color. What is your first step?", "initial", [
        choice("c1_gather_context", "Clarify affected jobs, material, timing, recent changes, device identity, and the customer's target.", "compare_scope", "Good start. You gathered context without treating the reported symptom as a confirmed cause.", { safety: 5, diagnostic: 10 }, 1),
        choice("c1_guess_head", "Declare the printhead failed and request a replacement before collecting evidence.", "terminal_premature", "A visible band does not establish a failed part. Record the symptom and gather approved evidence before proposing a replacement.", { diagnostic: -10, cost: -10 }, 2),
        choice("c1_unsafe_clean", "Open the equipment and attempt an undocumented nozzle-cleaning procedure.", "terminal_hazard", "Stop. A generic lesson cannot authorize opening equipment or performing a model-specific maintenance procedure.", { safety: -20 }, 3),
      ]),
      node("compare_scope", "Compare scope and approved evidence", "The issue is reported on one material, but the affected job and device records are incomplete. Which next step is most useful?", "test_selection", [
        choice("c1_review_records", "Record the exact job/material/configuration and review only diagnostic tests approved for this model and role.", "review_pattern", "Correct. The exact configuration and current approved test determine what the evidence means.", { safety: 5, diagnostic: 10, evidence: "Job revision and material are now recorded. The applicable manual authorizes a non-invasive diagnostic comparison for this simulation." }, 1),
        choice("c1_clean_means_fixed", "Treat a clean static nozzle pattern as proof that no head-related or dynamic issue is possible.", "terminal_overclaim", "A clean static pattern is limited evidence. It does not rule out every head or dynamic fault.", { diagnostic: -10 }, 2),
        choice("c1_change_many", "Change the material preset and multiple quality settings together, then decide by appearance.", "terminal_uncontrolled", "Several simultaneous changes make the result difficult to interpret and are not a documented diagnostic plan.", { diagnostic: -10, cost: -5 }, 3),
      ]),
      node("review_pattern", "Interpret the test within its limits", "The approved static pattern appears clean. The customer still reports bands during production. What conclusion is justified?", "hypothesis_review", [
        choice("c1_compare_dynamic", "Keep the head hypothesis open and compare approved output under controlled job/material conditions.", "controlled_test", "Good reasoning. A clean pattern narrows one observation but does not rule out all intermittent or dynamic causes.", { safety: 5, diagnostic: 10 }, 1),
        choice("c1_head_ruled_out", "Rule out every printhead fault and name media advance as the confirmed cause.", "terminal_overclaim", "Neither conclusion follows from one clean static pattern. The cause remains open.", { diagnostic: -10 }, 2),
      ]),
      node("controlled_test", "Define a discriminating comparison", "The symptom has not been reproduced with an approved reference job. Which plan best supports a careful handoff?", "verification", [
        choice("c1_document_escalate", "Record the symptom, test conditions and limits, preserve the sample, and agree on the next approved comparison with the system owner.", "terminal_band_safe", "The evidence and uncertainty are documented, and the next step is controlled and authorized.", { safety: 5, diagnostic: 10, cost: 5, evidence: "No repair is claimed. The case remains open pending the agreed comparison and customer-defined verification." }, 1),
        choice("c1_claim_repaired", "Tell the customer the machine is fixed because the static pattern was clean.", "terminal_overclaim", "The reported production symptom is unresolved; a clean static pattern is not proof of correction.", { diagnostic: -10 }, 2),
      ]),
      success("terminal_band_safe", "Safe evidence-based disposition", "The learner documented a limited test result, avoided an unsupported part diagnosis, and defined an authorized next comparison. No physical repair is implied."),
      fail("terminal_premature", "Unsupported part decision", "A symptom was converted into a part replacement without supporting evidence."),
      fail("terminal_hazard", "Stop-work and safety escalation required", "The proposed action exceeds this training case. Do not open or service equipment without the exact safe procedure and authorization.", true),
      fail("terminal_overclaim", "Conclusion exceeds the evidence", "Restart the exercise and distinguish what the test showed from what remains unknown."),
      fail("terminal_uncontrolled", "Uncontrolled changes obscure the diagnosis", "Restart and choose a controlled, documented comparison instead."),
    ],
  ),
  scenario(
    2,
    "Banding With a Clean Static Pattern",
    "case-02-banding-clean-nozzles",
    "Print-quality diagnosis",
    "intermediate",
    "“Our test pattern looks clean, but repeated production jobs still show dark bands. We think the controller board is bad.”",
    "The defect is reported during production; a single static pattern did not reproduce it.",
    "A clean static diagnostic is not proof that all imaging or dynamic behavior is fault-free. Job data, material, process settings, transport, and intermittent behavior remain hypotheses until tested.",
    "Document repeatability, affected jobs/materials, the limits of the static pattern, and a safe model-approved next test. Do not adjust feed or alignment values from this simulation.",
    [
      node("start", "Challenge the premature conclusion", "The customer proposes a board replacement. What do you do first?", "initial", [
        choice("c2_map_symptom", "Describe the band spacing and direction, affected jobs/materials, timing, and what the clean pattern actually tested.", "pattern_limits", "Good. You are gathering repeatable observations without accepting an unsupported board diagnosis.", { safety: 5, diagnostic: 10 }, 1),
        choice("c2_replace_board", "Approve a controller-board replacement because the nozzle pattern is clean.", "terminal_premature", "The test does not isolate a controller-board fault. A replacement would be premature.", { diagnostic: -10, cost: -10 }, 2),
        choice("c2_adjust_feed", "Enter a guessed media-advance correction until the bands disappear.", "terminal_guess", "A guessed adjustment is not a controlled diagnosis and could make output worse.", { diagnostic: -10, cost: -5 }, 3),
      ]),
      node("pattern_limits", "What did the clean pattern establish?", "The documented static pattern is clean under that test condition. The production symptom remains. Which interpretation is accurate?", "hypothesis_review", [
        choice("c2_keep_hypotheses", "It is limited evidence; retain multiple hypotheses and compare them with an approved production-relevant test.", "controlled_test", "Correct. A test only supports conclusions within its scope and conditions.", { safety: 5, diagnostic: 10 }, 1),
        choice("c2_rule_out_head", "It rules out every printhead issue, including faults that occur only during production.", "terminal_overclaim", "A clean static result cannot rule out every dynamic or intermittent fault.", { diagnostic: -10 }, 2),
      ]),
      node("controlled_test", "Plan the next comparison", "You have a sample, job ID, material, and device identity. What is the next responsible step?", "test_selection", [
        choice("c2_authorized_compare", "Ask the responsible owner to select a documented comparison that distinguishes job/material effects from device behavior.", "review_result", "The next test is selected for the exact installation, with authorization and a clear question.", { safety: 5, diagnostic: 10, evidence: "The reported pattern is limited to a defined job/material combination; no model-specific cause is established." }, 1),
        choice("c2_live_motion", "Open a guard and inspect moving components while the device is printing at speed.", "terminal_hazard", "Do not enter a hazardous area or defeat a guard to observe a production pass. Stop and obtain the required safe procedure.", { safety: -20 }, 2),
      ]),
      node("review_result", "Record what the comparison can show", "The approved comparison narrows the symptom to a specific job/material condition but does not identify a failed component. How do you close this training step?", "verification", [
        choice("c2_document_limits", "Record the narrowed scope, retain alternatives, and escalate for the exact approved follow-up test and customer target.", "terminal_band_safe", "Good. The result is a useful narrowing of scope, not an invented root cause.", { safety: 5, diagnostic: 10, cost: 5 }, 1),
        choice("c2_name_part", "Declare the nearest hardware component defective and close the ticket.", "terminal_premature", "The evidence narrows scope but does not identify that component as the cause.", { diagnostic: -10 }, 2),
      ]),
      success("terminal_band_safe", "Controlled diagnosis continued", "The learner used the clean pattern appropriately, preserved uncertainty, and documented the next authorized comparison."),
      fail("terminal_premature", "Unsupported replacement", "A part was selected without a discriminating test."),
      fail("terminal_guess", "Guessed adjustment", "A guessed value is not a supported correction."),
      fail("terminal_overclaim", "Static test overinterpreted", "A clean static result is limited to that test condition."),
      fail("terminal_hazard", "Hazardous observation rejected", "Do not observe moving equipment from inside a guarded area or bypass a protective device.", true),
    ],
  ),
  scenario(
    3,
    "Color Difference After a Material Change",
    "case-03-color-mismatch-substrate",
    "Color management",
    "intermediate",
    "“The approved red looks different on the new stock. Can you change the profile until the measurement passes?”",
    "A substrate change is reported; the target, measurement condition, and job setup have not been confirmed.",
    "Substrate appearance, job configuration, measurement method, and process can all matter. A ΔE result is not a universal pass/fail limit; agree on the correct target and method before interpreting or changing settings.",
    "Verify the target, material, formula, instrument condition, and agreed tolerance. Preserve the baseline and do not invent a ΔE threshold or automatically add an ink layer.",
    [
      node("start", "Define the color complaint", "The customer asks you to alter a profile until one value passes. What is your first response?", "initial", [
        choice("c3_confirm_target", "Confirm the exact target/revision, stock, job configuration, measurement formula/condition, and agreed acceptance limit.", "review_method", "Correct. The target and method need to be known before interpreting a result.", { safety: 5, diagnostic: 10 }, 1),
        choice("c3_universal_threshold", "Use a universal ΔE cutoff and change the profile until the number is below it.", "terminal_overclaim", "No single ΔE value is a universal acceptance rule for every job or measurement method.", { diagnostic: -10 }, 2),
        choice("c3_add_white", "Add a white-ink layer because the stock changed, without checking the device or specification.", "terminal_guess", "Ink layers and supported workflows are model- and job-specific; a substrate change alone does not authorize this choice.", { diagnostic: -10 }, 3),
      ]),
      node("review_method", "Check measurement comparability", "The original and new stock were measured under different conditions, and the acceptance rule is not attached. What can be concluded?", "hypothesis_review", [
        choice("c3_request_method", "The values are not yet a controlled comparison; obtain the agreed method and target owner before changing a profile.", "controlled_measurement", "Good. Different conditions can affect the comparison; do not force an interpretation.", { safety: 5, diagnostic: 10, evidence: "The two reported readings used unmatched conditions. No pass/fail conclusion is available in this case." }, 1),
        choice("c3_ignore_method", "The lower number is automatically the better result, regardless of condition.", "terminal_overclaim", "Numbers from unmatched conditions cannot be interpreted that way.", { diagnostic: -10 }, 2),
      ]),
      node("controlled_measurement", "Set a controlled color review", "The target owner supplies the required target and method. What is the appropriate next action?", "test_selection", [
        choice("c3_preserve_baseline", "Preserve the existing job setup, perform only the documented comparison when authorized, and record formula, condition, material, and result.", "review_findings", "This retains a baseline and makes the comparison traceable.", { safety: 5, diagnostic: 10 }, 1),
        choice("c3_change_settings", "Change several color settings before recording the current configuration.", "terminal_uncontrolled", "Changing multiple variables destroys the baseline and makes the outcome hard to interpret.", { diagnostic: -10 }, 2),
      ]),
      node("review_findings", "Communicate the result", "The controlled review shows the new stock differs from the target under the agreed method, but the approved correction route is not known. What do you do?", "verification", [
        choice("c3_escalate", "Document the measured result and uncertainty, then consult the current product workflow and color owner before proposing a correction.", "terminal_color_safe", "The result is factual; a correction is not guessed from a measurement alone.", { safety: 5, diagnostic: 10, cost: 5 }, 1),
        choice("c3_claim_compliance", "Claim that the job meets every standard because one measured difference was acceptable.", "terminal_overclaim", "Acceptance is limited to the agreed target, formula, conditions, and tolerance.", { diagnostic: -10 }, 2),
      ]),
      success("terminal_color_safe", "Color review documented", "The learner established comparable measurement conditions and escalated the model/workflow-specific correction question."),
      fail("terminal_overclaim", "Color claim exceeds evidence", "Restart and define the target, formula, method, and acceptance criteria before interpreting a number."),
      fail("terminal_guess", "Unsupported workflow change", "Do not add a layer or feature without confirming the exact device and customer specification."),
      fail("terminal_uncontrolled", "Baseline lost", "Restart and preserve the current configuration before a controlled comparison."),
    ],
  ),
  scenario(
    4,
    "Print Job Stalled in a Configured Queue",
    "case-04-job-stuck-in-rip",
    "Software and workflow",
    "intermediate",
    "“This print job has stopped progressing. The device appears available, but I do not know whether it received the job.”",
    "The exact workflow stages, queue owner, and status messages have not yet been collected.",
    "A stalled job can involve the file, processor, queue, communication path, or device. Identify the first observed point of failure and involve the system owner before changing queues, storage, or network configuration.",
    "Provide a timestamped, sanitized handoff that identifies the stage and authorized checks. Do not delete jobs, change IP settings, disable security, or assert a specific cause without evidence.",
    [
      node("start", "Locate the first observed failure", "The customer reports that one job is stalled. Which action is the best first step?", "initial", [
        choice("c4_trace_stage", "Record the job ID/time and identify the last confirmed stage and exact status/error in the configured workflow.", "compare_scope", "Good. Locating the first observed failure narrows the investigation without assuming a network or hardware cause.", { safety: 5, diagnostic: 10 }, 1),
        choice("c4_delete_queue", "Delete the entire shared queue and its temporary files immediately.", "terminal_uncontrolled", "Deleting jobs or files can disrupt other users and destroy evidence; get owner approval and a documented plan.", { diagnostic: -10, cost: -10 }, 2),
        choice("c4_random_ip", "Assign the device a new address so the job can find it.", "terminal_unauthorized", "An address change without network-owner authorization can disrupt the configured system.", { safety: -5, diagnostic: -10 }, 3),
      ]),
      node("compare_scope", "Determine the scope", "The job is visible in a shared queue, but no device receipt is confirmed. How should you narrow the issue?", "test_selection", [
        choice("c4_compare_authorized", "Ask the queue/system owner to compare processor, queue, transfer, and device status using approved tools.", "review_evidence", "The check follows the actual configuration and uses the right system owner.", { safety: 5, diagnostic: 10, evidence: "The available log shows the job waiting in the configured queue; downstream receipt has not been verified." }, 1),
        choice("c4_disable_security", "Disable network security and firewall controls to see if the job resumes.", "terminal_unauthorized", "Security controls are not diagnostic toggles; changes require approved ownership and change control.", { safety: -10, diagnostic: -10 }, 2),
      ]),
      node("review_evidence", "Separate reachability from workflow health", "A basic connectivity indicator is present, but the job remains queued. What does that prove?", "hypothesis_review", [
        choice("c4_limited_evidence", "Only that the specific connectivity check succeeded; application processing and job transfer still need evidence.", "handoff", "Correct. A limited network check does not prove the end-to-end print path works.", { safety: 5, diagnostic: 10 }, 1),
        choice("c4_ping_proves", "That the entire RIP-to-device workflow and job are healthy.", "terminal_overclaim", "A basic connection check does not verify file processing, queues, protocols, or device receipt.", { diagnostic: -10 }, 2),
      ]),
      node("handoff", "Prepare a useful support handoff", "You have the job ID, timestamp, exact queue state, and a sanitized status message. What next?", "verification", [
        choice("c4_escalate_owner", "Share the minimal relevant evidence with the authorized queue/network owner and agree on the next supported test.", "terminal_queue_safe", "The handoff preserves evidence and leaves changes with the responsible owner.", { safety: 5, diagnostic: 10, cost: 5 }, 1),
        choice("c4_guess_disk", "Declare the processor disk full without checking its documented status.", "terminal_overclaim", "A plausible cause is not a confirmed one; record it as a question until verified.", { diagnostic: -10 }, 2),
      ]),
      success("terminal_queue_safe", "Queue investigation handed off", "The learner located the observed stage, distinguished limited connectivity from end-to-end function, and avoided unauthorized changes."),
      fail("terminal_uncontrolled", "Evidence or jobs at risk", "Restart and collect the job and queue state before considering any approved change."),
      fail("terminal_unauthorized", "Change-control boundary crossed", "Network and security changes belong to the authorized system owner and approved change process."),
      fail("terminal_overclaim", "Conclusion exceeds evidence", "Restart and distinguish a hypothesis from a verified status."),
    ],
  ),
  scenario(
    5,
    "Adhesion or Curing Concern on a New Material",
    "case-05-inconsistent-curing-adhesion",
    "Materials and process safety",
    "advanced",
    "“Ink is not adhering consistently to this new material. Can we change the cure setting or try a solvent to make it stick?”",
    "The material, ink, device configuration, and product-specific compatibility documents have not been confirmed.",
    "Material compatibility, ink/process configuration, and curing behavior are product-specific. Chemical handling and changes require the exact current SDS, approved procedure, and qualified authorization; do not improvise a chemical or curing adjustment.",
    "The successful training outcome is a safe hold, documentation of the material and symptom, and escalation to the authorized product/application owner. No repair or pass result is implied.",
    [
      node("start", "Check product and chemical safety", "The suggested solvent and cure setting are not identified in the current documentation. What is your next step?", "initial", [
        choice("c5_hold_verify", "Hold the affected work as appropriate, identify the exact materials, and obtain the current SDS and model-specific approved process guidance.", "review_material", "Correct. Do not choose a chemical, exposure, or setting from a generic example.", { safety: 10, diagnostic: 5 }, 1),
        choice("c5_add_solvent", "Apply an unverified solvent to a sample and assess adhesion by touch.", "terminal_hazard", "Stop. Chemical identity, compatibility, PPE, ventilation, and procedure are unknown; do not improvise a test.", { safety: -20 }, 2),
        choice("c5_increase_cure", "Increase the curing setting until the surface feels dry.", "terminal_unsupported", "An undocumented setting change can create a safety, quality, or equipment issue and is not a validated acceptance test.", { safety: -10, diagnostic: -10 }, 3),
      ]),
      node("review_material", "Build a source-backed material record", "The exact material and product SDS are now available, but the supported process for this installation is not attached. What should be verified?", "test_selection", [
        choice("c5_compare_docs", "Confirm material compatibility, approved operating envelope, safe handling, and customer acceptance method with the responsible product owner.", "review_evidence", "The missing item is the installation-specific approved process, not a guessed setting.", { safety: 5, diagnostic: 10, evidence: "The SDS is available; the model-specific approved application and acceptance method remain unverified." }, 1),
        choice("c5_use_other_product", "Copy a cure value and solvent from another brand's printer documentation.", "terminal_unsupported", "A procedure for another product is not evidence that it is compatible here.", { safety: -10, diagnostic: -10 }, 2),
      ]),
      node("review_evidence", "Decide whether testing is authorized", "The customer requests a live production run before the supported process is confirmed. What is the correct decision?", "hypothesis_review", [
        choice("c5_escalate", "Do not run the unverified process; document the request and obtain approved, qualified application guidance.", "terminal_material_safe", "Good. The customer has a clear next step and the safety boundary is maintained.", { safety: 10, diagnostic: 10, cost: 5 }, 1),
        choice("c5_run_anyway", "Proceed with the unverified chemical and cure combination because production is urgent.", "terminal_hazard", "Production urgency does not establish material compatibility, chemical safety, or authorization.", { safety: -20 }, 2),
      ]),
      success("terminal_material_safe", "Safe application escalation", "The learner held an unverified process, captured the documentation gap, and escalated to a qualified owner. No material test is claimed."),
      fail("terminal_hazard", "Unsafe chemical/process proposal", "Stop work, follow site procedures, and obtain the exact SDS and qualified product guidance before any test." , true),
      fail("terminal_unsupported", "Unsupported product setting", "Do not transfer settings or chemical procedures across products without current model-specific approval."),
    ],
  ),
  scenario(
    6,
    "Repeated Artifact in a Scanner Capture",
    "case-06-metis-scan-artifacts",
    "Scanner imaging",
    "intermediate",
    "“A repeated stripe appears in the captured file. We have a METIS scanner, but I am not sure which model or software version produced this file.”",
    "The raw capture, exact scanner family, software version, and approved reference/calibration status have not been recorded.",
    "Scanner model and family matter. An artifact should be traced through the captured file and downstream workflow; calibration, reference handling, cleaning, and service actions must follow the exact model's current instructions.",
    "Record the source file, model/version, capture context, and approved comparison result. Escalate if the applicable calibration or cleaning procedure is unavailable.",
    [
      node("start", "Identify the capture system", "A stripe is visible in the delivered image, but the scanner model is uncertain. What do you do first?", "initial", [
        choice("c6_identify_file", "Preserve the original file and identify the exact scanner, software version, capture setup, and when the artifact first appears.", "compare_files", "Good. The original and system identity are essential before selecting scanner-specific guidance.", { safety: 5, diagnostic: 10 }, 1),
        choice("c6_clean_reference", "Clean the reference object with a generic optical solvent and recalibrate from memory.", "terminal_hazard", "Do not handle a reference or apply a solvent without the exact manufacturer's procedure.", { safety: -15, diagnostic: -10 }, 2),
        choice("c6_replace_camera", "Declare the camera defective and order a replacement.", "terminal_premature", "An artifact alone does not identify a failed camera or justify a part replacement.", { diagnostic: -10, cost: -10 }, 3),
      ]),
      node("compare_files", "Locate where the artifact enters", "The original capture file is available, and the stripe is visible in it. Which conclusion is supported?", "hypothesis_review", [
        choice("c6_trace_capture", "The artifact is present by the captured-file stage; investigate capture conditions using the exact model's approved method.", "check_reference", "Correct. The observation narrows the workflow stage without proving a specific component fault.", { safety: 5, diagnostic: 10, evidence: "The stripe is present in the original capture file. The root cause remains undetermined." }, 1),
        choice("c6_printer_fault", "The downstream printer is necessarily defective.", "terminal_overclaim", "An artifact already present in the source file does not prove a printer fault.", { diagnostic: -10 }, 2),
      ]),
      node("check_reference", "Check approved capture evidence", "The current model guide calls for a documented reference-status check, but the reference surface has not been assessed. What is appropriate?", "test_selection", [
        choice("c6_follow_manual", "Have an authorized user perform the manual's reference check and report the result; do not clean or calibrate by guesswork.", "review_result", "This uses a model-specific approved check and keeps reference handling within the procedure.", { safety: 5, diagnostic: 10 }, 1),
        choice("c6_guess_calibration", "Run a generic dark/white calibration routine copied from another scanner.", "terminal_unsupported", "Calibration routines are model-specific; a different scanner's procedure may be wrong.", { safety: -10, diagnostic: -10 }, 2),
      ]),
      node("review_result", "Prepare a support handoff", "The reference check has been recorded, but the stripe remains in repeated captures. What next?", "verification", [
        choice("c6_escalate", "Send the sanitized original, model/version, capture conditions, and reference-check result to authorized scanner support.", "terminal_scan_safe", "The evidence is reproducible and the remaining diagnosis is routed to qualified product support.", { safety: 5, diagnostic: 10, cost: 5 }, 1),
        choice("c6_publish_clean", "Remove the stripe in the customer file and report the scanner fixed without documenting the source artifact.", "terminal_overclaim", "Post-processing may hide evidence and does not establish that the scanner problem is resolved.", { diagnostic: -10 }, 2),
      ]),
      success("terminal_scan_safe", "Scanner evidence preserved", "The learner traced the artifact to the capture stage, recorded model-specific evidence, and escalated without inventing a calibration or cleaning step."),
      fail("terminal_hazard", "Stop before reference handling", "Use only the exact authorized manufacturer procedure for reference objects and cleaning.", true),
      fail("terminal_premature", "Unsupported component diagnosis", "A captured artifact is not sufficient evidence for camera replacement."),
      fail("terminal_overclaim", "Evidence hidden or misattributed", "Preserve the original capture and distinguish a workaround from a verified correction."),
      fail("terminal_unsupported", "Wrong-model procedure", "Confirm the exact scanner and use its current documentation."),
    ],
  ),
  scenario(
    7,
    "Raised or Curled Material Near a Moving Assembly",
    "case-07-head-strike-risk",
    "Immediate equipment safety",
    "advanced",
    "“A sheet edge is visibly raised near a moving assembly. The operator asks whether we can hold it down and finish this job.”",
    "The material is not lying flat; protective-device condition and the approved site response are unknown.",
    "A potential collision or entanglement is a stop-work condition. Keep people clear and use the site's approved stop/emergency response. An emergency stop is not energy isolation; do not enter a guarded area or service equipment without the applicable energy-control procedure and authorization.",
    "The correct training outcome is to stop the affected operation safely, prevent approach to the hazard, notify the responsible site contact, and defer inspection/restart to authorized personnel.",
    [
      node("start", "Protect people first", "Raised material is near moving equipment. What is the safest immediate response?", "safety_check", [
        choice("c7_stop_clear", "Use the site's approved stop-work response, keep people clear, and notify the responsible operator/safety contact.", "review_safe_state", "Correct. Prevent exposure without reaching toward moving equipment or treating a stop command as isolation.", { safety: 15, diagnostic: 5 }, 1),
        choice("c7_hold_by_hand", "Hold the material down by hand while the equipment continues moving.", "terminal_hazard", "Never reach toward moving equipment or place a person in the hazard zone to control material.", { safety: -30 }, 2),
        choice("c7_bypass", "Bypass a protective device to complete the job.", "terminal_hazard", "Do not defeat protective devices. Stop and escalate the unsafe condition.", { safety: -30 }, 3),
      ]),
      node("review_safe_state", "Do not confuse stop with isolation", "The process has been stopped using the site's approved response. A physical inspection is proposed, but the energy-control procedure is not available. What do you do?", "safety_check", [
        choice("c7_no_entry", "Do not enter or service the guarded area; obtain the exact site energy-control procedure and an authorized qualified person.", "terminal_hazard_safe", "Good. Stopping motion does not prove hazardous energy is isolated or stored energy controlled.", { safety: 15, diagnostic: 5 }, 1),
        choice("c7_enter_after_stop", "Enter immediately because the machine is no longer moving.", "terminal_hazard", "A stopped machine may still present hazardous energy or stored-energy risks. The approved procedure is required.", { safety: -30 }, 2),
      ]),
      success("terminal_hazard_safe", "Hazard safely escalated", "The learner stopped the affected work, protected people, and deferred inspection and restart to authorized site personnel. No repair or restart is implied."),
      fail("terminal_hazard", "Uncontrolled physical hazard", "Keep people clear, use the approved site response, and escalate. Do not reach in, bypass a device, or treat a stop as isolation.", true),
    ],
  ),
  scenario(
    8,
    "Intermittent Motion Concern After a Prior Visit",
    "case-08-recurring-carriage-fault",
    "Intermittent behavior and service history",
    "advanced",
    "“The system began reporting intermittent motion-related warnings after a recent service visit. We need to know whether the earlier work caused it.”",
    "A prior service record exists, but the warning timeline and exact device-specific diagnostic method have not been reviewed.",
    "Temporal sequence is useful evidence but does not prove causation. If unexpected motion or a protective warning occurs, stop the affected operation and follow the approved site response. Compare service records and logs without making undocumented mechanical adjustments.",
    "Create a fair, evidence-based timeline; preserve warnings and service records; stop if safety is uncertain; and obtain authorized model-specific support before adjustment or repair.",
    [
      node("start", "Respond to the warning", "An intermittent warning is reported. The device is currently idle; the safety meaning of the warning has not been confirmed. What do you do?", "initial", [
        choice("c8_record_timeline", "Record exact warning text, timestamps, operating conditions, model/version, and the prior service record; check the approved response.", "compare_history", "Good. You preserve evidence and use the current device guidance to determine whether operation can continue.", { safety: 5, diagnostic: 10 }, 1),
        choice("c8_blame_prior", "Conclude the previous technician caused the fault because it appeared afterward.", "terminal_blame", "Timing makes the visit relevant but does not prove causation. Compare evidence fairly.", { diagnostic: -10 }, 2),
        choice("c8_force_motion", "Run the device at maximum speed to make the warning recur.", "terminal_hazard", "Do not provoke an unassessed motion warning. Follow the approved safety response and test limits.", { safety: -20 }, 3),
      ]),
      node("compare_history", "Build a factual timeline", "The records show the symptom was first reported after the visit, but the exact conditions and warning history are incomplete. What is useful next?", "hypothesis_review", [
        choice("c8_compare_records", "Compare authorized before/after records and logs, separating documented observations from possible explanations.", "review_scope", "Correct. The timeline guides questions but is not a causal verdict.", { safety: 5, diagnostic: 10, evidence: "Prior service and first-report times are recorded; no component cause is established." }, 1),
        choice("c8_open_guard", "Open a guarded area and manually move the assembly to look for looseness.", "terminal_hazard", "This is not authorized by the scenario. Follow energy-control and model-specific service procedures.", { safety: -20 }, 2),
      ]),
      node("review_scope", "Decide whether further operation is safe", "The current manual's response to this warning is not available, and the customer requests another production run. What is the safe decision?", "safety_check", [
        choice("c8_pause_escalate", "Do not run an unassessed motion condition; request the exact approved response from the responsible site/product authority.", "terminal_motion_safe", "Good. You do not provoke a warning or guess at mechanical adjustments.", { safety: 10, diagnostic: 10 }, 1),
        choice("c8_adjust_bracket", "Tighten a nearby bracket and continue without recording a before/after condition.", "terminal_unsupported", "An undocumented adjustment is not a diagnosis or an approved repair.", { safety: -10, diagnostic: -10 }, 2),
      ]),
      success("terminal_motion_safe", "Motion concern safely referred", "The learner preserved the timeline, avoided blame and intrusive work, and paused operation pending an approved response."),
      fail("terminal_blame", "Causation not established", "Restart and distinguish a relevant timeline from proof of cause."),
      fail("terminal_hazard", "Unsafe motion inspection", "Stop and obtain the exact energy-control and service procedure before inspection.", true),
      fail("terminal_unsupported", "Unapproved adjustment", "Do not adjust mechanical assemblies without the exact current procedure and authorization."),
    ],
  ),
  scenario(
    9,
    "Intermittent Print-Job Communication",
    "case-09-network-communication-drop",
    "Network and workflow troubleshooting",
    "intermediate",
    "“One large job stopped transferring. A coworker says we should change the device address or disconnect office security.”",
    "The configured hosts, transfer stage, error message, and network owner are not yet confirmed.",
    "A communication symptom should be located in the configured workflow. A basic reachability check does not prove end-to-end job processing. Network and security changes require authorization and change control.",
    "Document job/timestamps, affected users and stages, exact errors, and authorized checks. Keep credentials out of the ticket and refer configuration changes to the system/network owner.",
    [
      node("start", "Locate the interruption", "One large job stopped transferring. What should be recorded before proposing a network change?", "initial", [
        choice("c9_record_scope", "Record job ID, host, time, exact error, affected users/jobs, and the last confirmed workflow stage.", "review_connectivity", "Good. This defines scope and preserves a useful diagnostic timeline.", { safety: 5, diagnostic: 10 }, 1),
        choice("c9_change_address", "Change the device address immediately based on a guess.", "terminal_unauthorized", "An address change can disrupt other systems and must be owned and approved.", { safety: -5, diagnostic: -10 }, 2),
        choice("c9_disable_controls", "Disable security controls to see whether transfer resumes.", "terminal_unauthorized", "Do not disable protective security without authorized review and change control.", { safety: -10, diagnostic: -10 }, 3),
      ]),
      node("review_connectivity", "Interpret a basic status check", "An approved basic reachability check succeeds, but the job remains incomplete. What does that tell you?", "hypothesis_review", [
        choice("c9_limited_check", "Only that the tested reachability path responded; processor, queue, protocol, file, and device receipt remain to be checked.", "authorized_test", "Correct. A limited check is not proof of an end-to-end healthy print workflow.", { safety: 5, diagnostic: 10 }, 1),
        choice("c9_end_to_end", "The entire print workflow is healthy, so the printer hardware must be defective.", "terminal_overclaim", "Neither end-to-end health nor a hardware fault follows from the limited check.", { diagnostic: -10 }, 2),
      ]),
      node("authorized_test", "Involve the network owner", "The print-system owner can review the configured transfer and queue logs. What is the right handoff?", "test_selection", [
        choice("c9_sanitized_handoff", "Share sanitized timestamps, job identifiers, error text, and authorized checks; ask the owner to select the documented next test.", "review_result", "The handoff protects customer data and leaves network control with the authorized owner.", { safety: 5, diagnostic: 10, evidence: "A basic reachability check succeeded; the application transfer error remains under review." }, 1),
        choice("c9_credentials", "Send stored credentials and full customer artwork to a personal email for analysis.", "terminal_unauthorized", "Do not share secrets or unnecessary customer content outside approved channels.", { safety: -10, diagnostic: -10 }, 2),
      ]),
      node("review_result", "Define the next step", "The system owner has the minimal evidence and requests a controlled test within the approved workflow. What do you do?", "verification", [
        choice("c9_follow_owner", "Coordinate the approved test, record its scope and result, and escalate if the issue persists.", "terminal_network_safe", "Good. Configuration changes remain under change control and the test is traceable.", { safety: 5, diagnostic: 10, cost: 5 }, 1),
        choice("c9_random_settings", "Change multiple network and queue settings before the controlled test.", "terminal_uncontrolled", "Multiple unrecorded changes risk disruption and obscure the cause.", { safety: -5, diagnostic: -10 }, 2),
      ]),
      success("terminal_network_safe", "Communication issue under controlled review", "The learner preserved scope, understood the limit of a reachability check, protected secrets, and involved the system owner."),
      fail("terminal_unauthorized", "Unauthorized network/security change", "Pause and involve the authorized network/security owner. Do not expose credentials or customer content."),
      fail("terminal_overclaim", "Reachability overinterpreted", "A basic network check does not prove the whole job path or diagnose hardware."),
      fail("terminal_uncontrolled", "Uncontrolled change set", "Record the current state and follow the approved change process."),
    ],
  ),
  scenario(
    10,
    "Burning Odor or Bypassed Protective Device",
    "case-10-unsafe-condition-shutdown",
    "Safety stop and escalation",
    "advanced",
    "“There is an unfamiliar burning odor near equipment, and a protective device may have been bypassed. Production is waiting—can you inspect inside?”",
    "The source, hazard, machine state, and site's emergency/energy-control response are unknown.",
    "An unfamiliar burning odor or bypassed protective device requires an immediate safe stop-work response and escalation. Keep people clear and follow site emergency procedures. Do not open equipment, restart, or assume an emergency stop has isolated hazardous energy.",
    "Successful completion is safe containment and escalation to the responsible site emergency/safety and qualified service personnel. No diagnosis, repair, or restart is part of this case.",
    [
      node("start", "Treat the condition as hazardous", "The source of the odor and the state of a protective device are unknown. What is your response?", "safety_check", [
        choice("c10_stop_clear", "Keep people clear, follow the site's emergency/stop-work procedure, notify the responsible safety contact, and do not investigate inside.", "safe_escalation", "Correct. Contain the situation and use site emergency response; do not attempt a field diagnosis in an uncontrolled condition.", { safety: 20, diagnostic: 5 }, 1),
        choice("c10_open_cabinet", "Open the equipment cabinet to locate the odor while the system remains energized.", "terminal_fire_hazard", "Do not enter or open energized equipment. Stop, keep clear, and call the designated site emergency/qualified personnel.", { safety: -30 }, 2),
        choice("c10_restart", "Reset the protective device and restart production to see whether the odor returns.", "terminal_fire_hazard", "Never bypass or reset an unknown protective condition to reproduce a hazardous symptom.", { safety: -30 }, 3),
      ]),
      node("safe_escalation", "Keep the boundary in place", "The area is being managed under site procedure. A customer asks whether pressing an emergency stop is enough to authorize cabinet inspection. What do you say?", "safety_check", [
        choice("c10_isolation_boundary", "No. A stop command does not prove energy isolation; inspection/service requires the applicable site procedure and an authorized qualified person.", "terminal_safe", "Correct. You have not substituted an E-stop for energy control or entered the hazardous area.", { safety: 15, diagnostic: 5 }, 1),
        choice("c10_estop_isolation", "Yes. An emergency stop proves all hazardous energy is isolated, so open the cabinet.", "terminal_fire_hazard", "An emergency stop is not, by itself, energy isolation or proof that stored energy is safe.", { safety: -30 }, 2),
      ]),
      success("terminal_safe", "Hazard contained and escalated", "The learner followed site emergency response, kept people clear, did not restart or inspect inside, and referred energy control to authorized personnel. No repair or restart is implied."),
      fail("terminal_fire_hazard", "Unsafe investigation or restart", "Stop. Keep people clear, use the site emergency response, and leave equipment access to the responsible qualified personnel.", true),
    ],
  ),
];
