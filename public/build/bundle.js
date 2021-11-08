
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self$1(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.5' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function bounceOut(t) {
        const a = 4.0 / 11.0;
        const b = 8.0 / 11.0;
        const c = 9.0 / 10.0;
        const ca = 4356.0 / 361.0;
        const cb = 35442.0 / 1805.0;
        const cc = 16061.0 / 1805.0;
        const t2 = t * t;
        return t < a
            ? 7.5625 * t2
            : t < b
                ? 9.075 * t2 - 9.9 * t + 3.4
                : t < c
                    ? ca * t2 - cb * t + cc
                    : 10.8 * t * t - 20.52 * t + 10.72;
    }
    function bounceInOut(t) {
        return t < 0.5
            ? 0.5 * (1.0 - bounceOut(1.0 - t * 2.0))
            : 0.5 * bounceOut(t * 2.0 - 1.0) + 0.5;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const defaults = {
      duration: 4000,
      initial: 1,
      next: 0,
      pausable: false,
      dismissable: true,
      reversed: false,
      intro: { x: 256 },
      theme: {}
    };

    const createToast = () => {
      const { subscribe, update } = writable([]);
      let count = 0;
      const options = {};
      const _obj = (obj) => obj instanceof Object;
      const push = (msg, opts = {}) => {
        const param = { target: 'default', ...(_obj(msg) ? msg : { ...opts, msg }) };
        const conf = options[param.target] || {};
        const entry = {
          ...defaults,
          ...conf,
          ...param,
          theme: { ...conf.theme, ...param.theme },
          id: ++count
        };
        update((n) => (entry.reversed ? [...n, entry] : [entry, ...n]));
        return count
      };
      const pop = (id) => {
        update((n) => {
          if (!n.length || id === 0) return []
          if (_obj(id)) return n.filter((i) => id(i))
          const target = id || Math.max(...n.map((i) => i.id));
          return n.filter((i) => i.id !== target)
        });
      };
      const set = (id, opts = {}) => {
        const param = _obj(id) ? { ...id } : { ...opts, id };
        update((n) => {
          const idx = n.findIndex((i) => i.id === param.id);
          if (idx > -1) {
            n[idx] = { ...n[idx], ...param };
          }
          return n
        });
      };
      const _init = (target = 'default', opts = {}) => {
        options[target] = opts;
        return options
      };
      return { subscribe, push, pop, set, _init }
    };

    const toast = createToast();

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* node_modules/@zerodevx/svelte-toast/src/ToastItem.svelte generated by Svelte v3.42.5 */
    const file$9 = "node_modules/@zerodevx/svelte-toast/src/ToastItem.svelte";

    // (132:4) {:else}
    function create_else_block(ctx) {
    	let html_tag;
    	let raw_value = /*item*/ ctx[0].msg + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item*/ 1 && raw_value !== (raw_value = /*item*/ ctx[0].msg + "")) html_tag.p(raw_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(132:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (130:4) {#if item.component}
    function create_if_block_1$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*getProps*/ ctx[6]()];
    	var switch_value = /*item*/ ctx[0].component.src;

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*getProps*/ 64)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*getProps*/ ctx[6]())])
    			: {};

    			if (switch_value !== (switch_value = /*item*/ ctx[0].component.src)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(130:4) {#if item.component}",
    		ctx
    	});

    	return block;
    }

    // (136:2) {#if item.dismissable}
    function create_if_block$2(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "✕";
    			attr_dev(div, "class", "_toastBtn pe svelte-j9nwjb");
    			attr_dev(div, "role", "button");
    			attr_dev(div, "tabindex", "-1");
    			add_location(div, file$9, 136, 4, 3520);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*close*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(136:2) {#if item.dismissable}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block0;
    	let t0;
    	let t1;
    	let progress_1;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*item*/ ctx[0].component) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*item*/ ctx[0].dismissable && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			progress_1 = element("progress");
    			attr_dev(div0, "class", "_toastMsg svelte-j9nwjb");
    			toggle_class(div0, "pe", /*item*/ ctx[0].component);
    			add_location(div0, file$9, 128, 2, 3293);
    			attr_dev(progress_1, "class", "_toastBar svelte-j9nwjb");
    			progress_1.value = /*$progress*/ ctx[1];
    			add_location(progress_1, file$9, 138, 2, 3609);
    			attr_dev(div1, "class", "_toastItem svelte-j9nwjb");
    			toggle_class(div1, "pe", /*item*/ ctx[0].pausable);
    			add_location(div1, file$9, 127, 0, 3196);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div1, t0);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, progress_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "mouseenter", /*pause*/ ctx[4], false, false, false),
    					listen_dev(div1, "mouseleave", /*resume*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div0, null);
    			}

    			if (dirty & /*item*/ 1) {
    				toggle_class(div0, "pe", /*item*/ ctx[0].component);
    			}

    			if (/*item*/ ctx[0].dismissable) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(div1, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty & /*$progress*/ 2) {
    				prop_dev(progress_1, "value", /*$progress*/ ctx[1]);
    			}

    			if (dirty & /*item*/ 1) {
    				toggle_class(div1, "pe", /*item*/ ctx[0].pausable);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $progress;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToastItem', slots, []);
    	let { item } = $$props;
    	const progress = tweened(item.initial, { duration: item.duration, easing: identity });
    	validate_store(progress, 'progress');
    	component_subscribe($$self, progress, value => $$invalidate(1, $progress = value));

    	const close = () => {
    		const { id, onpop } = item;
    		toast.pop(id);

    		if (typeof onpop === 'function') {
    			onpop(id);
    		}
    	};

    	const autoclose = () => {
    		if ($progress === 1 || $progress === 0) {
    			close();
    		}
    	};

    	let next = item.initial;
    	let prev = next;
    	let paused = false;

    	const pause = () => {
    		if (item.pausable && !paused && $progress !== next) {
    			progress.set($progress, { duration: 0 });
    			paused = true;
    		}
    	};

    	const resume = () => {
    		if (paused) {
    			const d = item.duration;
    			const duration = d - d * (($progress - prev) / (next - prev));
    			progress.set(next, { duration }).then(autoclose);
    			paused = false;
    		}
    	};

    	const getProps = () => {
    		const { props = {}, sendIdTo } = item.component;

    		if (sendIdTo) {
    			props[sendIdTo] = item.id;
    		}

    		return props;
    	};

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		tweened,
    		linear: identity,
    		toast,
    		item,
    		progress,
    		close,
    		autoclose,
    		next,
    		prev,
    		paused,
    		pause,
    		resume,
    		getProps,
    		$progress
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('next' in $$props) $$invalidate(7, next = $$props.next);
    		if ('prev' in $$props) prev = $$props.prev;
    		if ('paused' in $$props) paused = $$props.paused;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*item*/ 1) {
    			// `progress` has been renamed to `next`; shim included for backward compatibility, to remove in next major
    			if (typeof item.progress !== 'undefined') {
    				$$invalidate(0, item.next = item.progress, item);
    			}
    		}

    		if ($$self.$$.dirty & /*next, item, $progress*/ 131) {
    			if (next !== item.next) {
    				$$invalidate(7, next = item.next);
    				prev = $progress;
    				paused = false;
    				progress.set(next).then(autoclose);
    			}
    		}
    	};

    	return [item, $progress, progress, close, pause, resume, getProps, next];
    }

    class ToastItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastItem",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<ToastItem> was created without expected prop 'item'");
    		}
    	}

    	get item() {
    		throw new Error("<ToastItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<ToastItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@zerodevx/svelte-toast/src/SvelteToast.svelte generated by Svelte v3.42.5 */

    const { Object: Object_1 } = globals;
    const file$8 = "node_modules/@zerodevx/svelte-toast/src/SvelteToast.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (34:2) {#each items as item (item.id)}
    function create_each_block$1(key_1, ctx) {
    	let li;
    	let toastitem;
    	let t;
    	let li_style_value;
    	let li_intro;
    	let li_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	toastitem = new ToastItem({
    			props: { item: /*item*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			create_component(toastitem.$$.fragment);
    			t = space();
    			attr_dev(li, "style", li_style_value = /*getCss*/ ctx[1](/*item*/ ctx[5].theme));
    			add_location(li, file$8, 34, 4, 815);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(toastitem, li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const toastitem_changes = {};
    			if (dirty & /*items*/ 1) toastitem_changes.item = /*item*/ ctx[5];
    			toastitem.$set(toastitem_changes);

    			if (!current || dirty & /*items*/ 1 && li_style_value !== (li_style_value = /*getCss*/ ctx[1](/*item*/ ctx[5].theme))) {
    				attr_dev(li, "style", li_style_value);
    			}
    		},
    		r: function measure() {
    			rect = li.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(li);
    			stop_animation();
    			add_transform(li, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(li, rect, flip, { duration: 200 });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toastitem.$$.fragment, local);

    			add_render_callback(() => {
    				if (li_outro) li_outro.end(1);
    				li_intro = create_in_transition(li, fly, /*item*/ ctx[5].intro);
    				li_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toastitem.$$.fragment, local);
    			if (li_intro) li_intro.invalidate();
    			li_outro = create_out_transition(li, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(toastitem);
    			if (detaching && li_outro) li_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(34:2) {#each items as item (item.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[5].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "_toastContainer svelte-7xr3c1");
    			add_location(ul, file$8, 32, 0, 748);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*getCss, items*/ 3) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, fix_and_outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $toast;
    	validate_store(toast, 'toast');
    	component_subscribe($$self, toast, $$value => $$invalidate(4, $toast = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SvelteToast', slots, []);
    	let { options = {} } = $$props;
    	let { target = 'default' } = $$props;
    	let items;
    	const getCss = theme => Object.keys(theme).reduce((a, c) => `${a}${c}:${theme[c]};`, '');
    	const writable_props = ['options', 'target'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SvelteToast> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('target' in $$props) $$invalidate(3, target = $$props.target);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		fly,
    		flip,
    		toast,
    		ToastItem,
    		options,
    		target,
    		items,
    		getCss,
    		$toast
    	});

    	$$self.$inject_state = $$props => {
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('target' in $$props) $$invalidate(3, target = $$props.target);
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*target, options*/ 12) {
    			toast._init(target, options);
    		}

    		if ($$self.$$.dirty & /*$toast, target*/ 24) {
    			$$invalidate(0, items = $toast.filter(i => i.target === target));
    		}
    	};

    	return [items, getCss, options, target, $toast];
    }

    class SvelteToast extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { options: 2, target: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SvelteToast",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get options() {
    		throw new Error("<SvelteToast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<SvelteToast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get target() {
    		throw new Error("<SvelteToast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set target(value) {
    		throw new Error("<SvelteToast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const serverUrl = "https://memo-silver-app.herokuapp.com/api/";
    const apiUrl = serverUrl;
    const defaultHeaders = new Headers();
    defaultHeaders.set('Content-Type', 'application/json');
    const responseHandler = (response, clearResponse) => {
        if (!response.ok) {
            console.error(response);
        }
        return clearResponse ? response : response.json();
    };
    const getApiResponse = async (currentUrl, reqType, params, clearResponse) => {
        try {
            let paramsObj = {
                method: reqType,
                headers: defaultHeaders,
                body: null
            };
            if (params)
                paramsObj = Object.assign(Object.assign({}, paramsObj), { body: JSON.stringify(params) });
            const response = await window.fetch(apiUrl + currentUrl, paramsObj);
            return responseHandler(response, clearResponse);
        }
        catch (error) {
            new Error(error.statusText);
        }
    };

    const defaultToastOpt = {
      duration: 8000,
      initial: 1,
      pausable: true,
    };

    const selectedTheme =  {
      warningTheme :{
        '--toastBackground': '#F56565',
            '--toastBarBackground': '#C53030'
      },
      successTheme : {
        '--toastBackground': '#48BB78',
            '--toastBarBackground': '#2F855A'
      }
    };

    const showToast = (message, theme) => {
      const th = selectedTheme[theme];
      const currentTheme = {
        theme: th
      };
      Object.assign(defaultToastOpt, currentTheme);
      toast.push(message  , defaultToastOpt);
    };

    /* src/Components/_common/atoms/memoStatusesView.svelte generated by Svelte v3.42.5 */
    const file$7 = "src/Components/_common/atoms/memoStatusesView.svelte";

    function create_fragment$7(ctx) {
    	let label0;
    	let t1;
    	let label1;
    	let input;
    	let t2;
    	let i;
    	let t3;
    	let i_class_value;
    	let t4;
    	let span;
    	let t5;
    	let span_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label0 = element("label");
    			label0.textContent = "Status:";
    			t1 = space();
    			label1 = element("label");
    			input = element("input");
    			t2 = space();
    			i = element("i");
    			t3 = text("radio_button_unchecked");
    			t4 = space();
    			span = element("span");
    			t5 = text(/*statusHru*/ ctx[1]);
    			attr_dev(label0, "for", "status");
    			add_location(label0, file$7, 0, 0, 0);
    			attr_dev(input, "class", "status_input svelte-1gjrlw3");
    			attr_dev(input, "id", "status");
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$7, 2, 2, 91);
    			attr_dev(i, "class", i_class_value = "material-icons status " + (/*statusMemoInput*/ ctx[0] ? 'complete' : 'pending'));
    			add_location(i, file$7, 3, 2, 173);
    			attr_dev(span, "class", span_class_value = "status-label " + /*statusHru*/ ctx[1] + " svelte-1gjrlw3");
    			add_location(span, file$7, 6, 2, 286);
    			attr_dev(label1, "for", "status");
    			attr_dev(label1, "class", "flex-grid adjust-center svelte-1gjrlw3");
    			add_location(label1, file$7, 1, 0, 36);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, label1, anchor);
    			append_dev(label1, input);
    			append_dev(label1, t2);
    			append_dev(label1, i);
    			append_dev(i, t3);
    			append_dev(label1, t4);
    			append_dev(label1, span);
    			append_dev(span, t5);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*emitStatus*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*statusMemoInput*/ 1 && i_class_value !== (i_class_value = "material-icons status " + (/*statusMemoInput*/ ctx[0] ? 'complete' : 'pending'))) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*statusHru*/ 2) set_data_dev(t5, /*statusHru*/ ctx[1]);

    			if (dirty & /*statusHru*/ 2 && span_class_value !== (span_class_value = "status-label " + /*statusHru*/ ctx[1] + " svelte-1gjrlw3")) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(label1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let statusHru;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MemoStatusesView', slots, []);
    	let { statusMemo = false } = $$props;
    	let statusMemoInput = false;
    	const dispatch = new createEventDispatcher();

    	const emitStatus = e => {
    		$$invalidate(0, statusMemoInput = e.target.checked);
    		dispatch('changeStatusInput', statusMemoInput);
    	};

    	onMount(() => {
    		$$invalidate(0, statusMemoInput = statusMemo);
    	});

    	const writable_props = ['statusMemo'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MemoStatusesView> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('statusMemo' in $$props) $$invalidate(3, statusMemo = $$props.statusMemo);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		statusMemo,
    		statusMemoInput,
    		dispatch,
    		emitStatus,
    		statusHru
    	});

    	$$self.$inject_state = $$props => {
    		if ('statusMemo' in $$props) $$invalidate(3, statusMemo = $$props.statusMemo);
    		if ('statusMemoInput' in $$props) $$invalidate(0, statusMemoInput = $$props.statusMemoInput);
    		if ('statusHru' in $$props) $$invalidate(1, statusHru = $$props.statusHru);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*statusMemoInput*/ 1) {
    			$$invalidate(1, statusHru = statusMemoInput ? "––Complete" : "––Pending");
    		}
    	};

    	return [statusMemoInput, statusHru, emitStatus, statusMemo];
    }

    class MemoStatusesView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { statusMemo: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MemoStatusesView",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get statusMemo() {
    		throw new Error("<MemoStatusesView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set statusMemo(value) {
    		throw new Error("<MemoStatusesView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Memos/add-modal.svelte generated by Svelte v3.42.5 */
    const file$6 = "src/Components/Memos/add-modal.svelte";

    function create_fragment$6(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let i;
    	let t1;
    	let form;
    	let label0;
    	let t3;
    	let input;
    	let t4;
    	let label1;
    	let t6;
    	let textarea;
    	let t7;
    	let memostatusesview;
    	let t8;
    	let button;
    	let t9;
    	let current;
    	let mounted;
    	let dispose;

    	memostatusesview = new MemoStatusesView({
    			props: { statusMemo: /*statusMemo*/ ctx[1] },
    			$$inline: true
    		});

    	memostatusesview.$on("changeStatusInput", /*onChangeStatusMemo*/ ctx[3]);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			i = element("i");
    			i.textContent = "close";
    			t1 = space();
    			form = element("form");
    			label0 = element("label");
    			label0.textContent = "Enter memo name";
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			label1 = element("label");
    			label1.textContent = "Description";
    			t6 = space();
    			textarea = element("textarea");
    			t7 = space();
    			create_component(memostatusesview.$$.fragment);
    			t8 = space();
    			button = element("button");
    			t9 = text("Create note");
    			attr_dev(i, "class", "close_icon close material-icons svelte-waavav");
    			add_location(i, file$6, 3, 6, 103);
    			attr_dev(div0, "class", "close_icon__wrapper svelte-waavav");
    			add_location(div0, file$6, 2, 4, 63);
    			attr_dev(label0, "for", "name");
    			attr_dev(label0, "class", "svelte-waavav");
    			add_location(label0, file$6, 6, 6, 284);
    			attr_dev(input, "id", "name");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "name");
    			attr_dev(input, "class", "svelte-waavav");
    			add_location(input, file$6, 7, 6, 334);
    			attr_dev(label1, "for", "description");
    			attr_dev(label1, "class", "svelte-waavav");
    			add_location(label1, file$6, 9, 6, 410);
    			attr_dev(textarea, "class", "description_field svelte-waavav");
    			attr_dev(textarea, "rows", "4");
    			attr_dev(textarea, "id", "description");
    			attr_dev(textarea, "name", "description");
    			add_location(textarea, file$6, 10, 6, 463);
    			button.disabled = /*disabled*/ ctx[2];
    			attr_dev(button, "class", "action-btn add-memo svelte-waavav");
    			add_location(button, file$6, 22, 6, 755);
    			attr_dev(form, "class", "memo-controls-form svelte-waavav");
    			attr_dev(form, "name", "memo-controls-form");
    			add_location(form, file$6, 5, 4, 193);
    			attr_dev(div1, "class", "add_modal__content svelte-waavav");
    			add_location(div1, file$6, 1, 2, 26);
    			attr_dev(div2, "class", "add_modal svelte-waavav");
    			add_location(div2, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, i);
    			append_dev(div1, t1);
    			append_dev(div1, form);
    			append_dev(form, label0);
    			append_dev(form, t3);
    			append_dev(form, input);
    			set_input_value(input, /*memoForm*/ ctx[0].name);
    			append_dev(form, t4);
    			append_dev(form, label1);
    			append_dev(form, t6);
    			append_dev(form, textarea);
    			set_input_value(textarea, /*memoForm*/ ctx[0].description);
    			append_dev(form, t7);
    			mount_component(memostatusesview, form, null);
    			append_dev(form, t8);
    			append_dev(form, button);
    			append_dev(button, t9);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(i, "click", /*closeModal*/ ctx[5], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[7]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[8]),
    					listen_dev(button, "click", /*createMemo*/ ctx[4], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[6]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*memoForm*/ 1 && input.value !== /*memoForm*/ ctx[0].name) {
    				set_input_value(input, /*memoForm*/ ctx[0].name);
    			}

    			if (dirty & /*memoForm*/ 1) {
    				set_input_value(textarea, /*memoForm*/ ctx[0].description);
    			}

    			const memostatusesview_changes = {};
    			if (dirty & /*statusMemo*/ 2) memostatusesview_changes.statusMemo = /*statusMemo*/ ctx[1];
    			memostatusesview.$set(memostatusesview_changes);

    			if (!current || dirty & /*disabled*/ 4) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(memostatusesview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(memostatusesview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(memostatusesview);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Add_modal', slots, []);
    	const dispatch = createEventDispatcher();

    	let memoForm = {
    		name: null,
    		description: null,
    		status: false
    	};

    	let disabled;
    	let statusMemo;
    	let statusHru;

    	const onChangeStatusMemo = status => {
    		$$invalidate(1, statusMemo = status.detail);
    	};

    	const createMemo = () => {
    		$$invalidate(0, memoForm.status = statusMemo, memoForm);
    		dispatch('addMemo', { memoForm });
    	};

    	const closeModal = () => {
    		dispatch('closeModal', false);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Add_modal> was created with unknown prop '${key}'`);
    	});

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler() {
    		memoForm.name = this.value;
    		$$invalidate(0, memoForm);
    	}

    	function textarea_input_handler() {
    		memoForm.description = this.value;
    		$$invalidate(0, memoForm);
    	}

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		MemoStatusesView,
    		dispatch,
    		memoForm,
    		disabled,
    		statusMemo,
    		statusHru,
    		onChangeStatusMemo,
    		createMemo,
    		closeModal
    	});

    	$$self.$inject_state = $$props => {
    		if ('memoForm' in $$props) $$invalidate(0, memoForm = $$props.memoForm);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
    		if ('statusMemo' in $$props) $$invalidate(1, statusMemo = $$props.statusMemo);
    		if ('statusHru' in $$props) statusHru = $$props.statusHru;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*memoForm*/ 1) {
    			$$invalidate(2, disabled = !!!memoForm.name);
    		}

    		if ($$self.$$.dirty & /*statusMemo*/ 2) {
    			statusHru = statusMemo ? "––Complete" : "––Pending";
    		}
    	};

    	return [
    		memoForm,
    		statusMemo,
    		disabled,
    		onChangeStatusMemo,
    		createMemo,
    		closeModal,
    		submit_handler,
    		input_input_handler,
    		textarea_input_handler
    	];
    }

    class Add_modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Add_modal",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var dayjs_min = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",$="Invalid Date",l=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},g={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},D="en",v={};v[D]=M;var p=function(t){return t instanceof _},S=function(t,e,n){var r;if(!t)return D;if("string"==typeof t)v[t]&&(r=t),e&&(v[t]=e,r=t);else {var i=t.name;v[i]=t,r=i;}return !n&&r&&(D=r),r||!n&&D},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=g;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(l);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===$)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),$=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},l=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,g="set"+(this.$u?"UTC":"");switch(h){case c:return r?$(1,0):$(31,11);case f:return r?$(1,M):$(0,M+1);case o:var D=this.$locale().weekStart||0,v=(y<D?y+7:y)-D;return $(r?m-v:m+(6-v),M);case a:case d:return l(g+"Hours",0);case u:return l(g+"Minutes",1);case s:return l(g+"Seconds",2);case i:return l(g+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),$=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],l=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[$](l),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else $&&this.$d[$](l);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,$=this;r=Number(r);var l=O.p(h),y=function(t){var e=w($);return O.w(e.date(e.date()+Math.round(t*r)),$)};if(l===f)return this.set(f,this.$M+r);if(l===c)return this.set(c,this.$y+r);if(l===a)return y(1);if(l===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[l]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||$;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].substr(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||l[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,$){var l,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,g=this-M,D=O.m(this,M);return D=(l={},l[c]=D/12,l[f]=D,l[h]=D/3,l[o]=(g-m)/6048e5,l[a]=(g-m)/864e5,l[u]=g/n,l[s]=g/e,l[i]=g/t,l)[y]||g,$?D:O.a(D)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return v[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),b=_.prototype;return w.prototype=b,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){b[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=v[D],w.Ls=v,w.p={},w}));
    });

    /* src/Components/Memos/memo-preview.svelte generated by Svelte v3.42.5 */
    const file$5 = "src/Components/Memos/memo-preview.svelte";

    function create_fragment$5(ctx) {
    	let div7;
    	let div6;
    	let div0;
    	let label0;
    	let b0;
    	let t1;
    	let br0;
    	let t2;
    	let input0;
    	let t3;
    	let div1;
    	let label1;
    	let b1;
    	let t5;
    	let br1;
    	let t6;
    	let textarea;
    	let t7;
    	let div5;
    	let div4;
    	let div2;
    	let span;
    	let t9;
    	let input1;
    	let t10;
    	let div3;
    	let i;
    	let t12;
    	let t13;
    	let t14;
    	let button0;
    	let t16;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div6 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			b0 = element("b");
    			b0.textContent = "Name:";
    			t1 = space();
    			br0 = element("br");
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			div1 = element("div");
    			label1 = element("label");
    			b1 = element("b");
    			b1.textContent = "Description:";
    			t5 = space();
    			br1 = element("br");
    			t6 = space();
    			textarea = element("textarea");
    			t7 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			span = element("span");
    			span.textContent = "Status:";
    			t9 = space();
    			input1 = element("input");
    			t10 = space();
    			div3 = element("div");
    			i = element("i");
    			i.textContent = "schedule";
    			t12 = space();
    			t13 = text(/*formatedDate*/ ctx[1]);
    			t14 = space();
    			button0 = element("button");
    			button0.textContent = "Update";
    			t16 = space();
    			button1 = element("button");
    			button1.textContent = "close";
    			add_location(b0, file$5, 17, 29, 419);
    			attr_dev(label0, "for", "memo-name");
    			add_location(label0, file$5, 17, 6, 396);
    			add_location(br0, file$5, 18, 6, 446);
    			attr_dev(input0, "id", "memo-name");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "custom-input");
    			add_location(input0, file$5, 19, 6, 457);
    			add_location(div0, file$5, 16, 4, 384);
    			add_location(b1, file$5, 28, 36, 634);
    			attr_dev(label1, "for", "memo-description");
    			add_location(label1, file$5, 28, 6, 604);
    			add_location(br1, file$5, 29, 6, 668);
    			attr_dev(textarea, "class", "custom-input area description_field");
    			attr_dev(textarea, "rows", "4");
    			attr_dev(textarea, "id", "memo-description");
    			attr_dev(textarea, "name", "description");
    			add_location(textarea, file$5, 30, 6, 679);
    			add_location(div1, file$5, 27, 4, 592);
    			attr_dev(span, "class", "memo_status-box__label svelte-10oped4");
    			add_location(span, file$5, 42, 10, 1031);
    			attr_dev(input1, "class", "memo_status-box__input svelte-10oped4");
    			attr_dev(input1, "id", "memo-status");
    			attr_dev(input1, "type", "checkbox");
    			add_location(input1, file$5, 43, 10, 1093);
    			attr_dev(div2, "class", "memo_status-box svelte-10oped4");
    			add_location(div2, file$5, 41, 8, 991);
    			attr_dev(i, "class", "material-icons");
    			add_location(i, file$5, 52, 10, 1324);
    			attr_dev(div3, "class", "flex-grid adjust-center svelte-10oped4");
    			add_location(div3, file$5, 51, 8, 1276);
    			attr_dev(div4, "class", "flex-grid adjust-center justify-s-side-in memo_status-box__time-edit svelte-10oped4");
    			add_location(div4, file$5, 40, 6, 900);
    			add_location(div5, file$5, 39, 4, 888);
    			attr_dev(button0, "class", "action-btn success w100");
    			add_location(button0, file$5, 58, 4, 1432);
    			attr_dev(button1, "class", "action-btn warn w100");
    			add_location(button1, file$5, 62, 4, 1527);
    			attr_dev(div6, "class", "memo_preview__inner svelte-10oped4");
    			add_location(div6, file$5, 15, 2, 346);
    			attr_dev(div7, "class", "memo_preview svelte-10oped4");
    			add_location(div7, file$5, 14, 0, 317);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div0);
    			append_dev(div0, label0);
    			append_dev(label0, b0);
    			append_dev(div0, t1);
    			append_dev(div0, br0);
    			append_dev(div0, t2);
    			append_dev(div0, input0);
    			set_input_value(input0, /*note*/ ctx[0].name);
    			append_dev(div6, t3);
    			append_dev(div6, div1);
    			append_dev(div1, label1);
    			append_dev(label1, b1);
    			append_dev(div1, t5);
    			append_dev(div1, br1);
    			append_dev(div1, t6);
    			append_dev(div1, textarea);
    			set_input_value(textarea, /*note*/ ctx[0].description);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, span);
    			append_dev(div2, t9);
    			append_dev(div2, input1);
    			input1.checked = /*note*/ ctx[0].status;
    			append_dev(div4, t10);
    			append_dev(div4, div3);
    			append_dev(div3, i);
    			append_dev(div3, t12);
    			append_dev(div3, t13);
    			append_dev(div6, t14);
    			append_dev(div6, button0);
    			append_dev(div6, t16);
    			append_dev(div6, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[5]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[6]),
    					listen_dev(button0, "click", /*updateNote*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*click_handler*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*note*/ 1 && input0.value !== /*note*/ ctx[0].name) {
    				set_input_value(input0, /*note*/ ctx[0].name);
    			}

    			if (dirty & /*note*/ 1) {
    				set_input_value(textarea, /*note*/ ctx[0].description);
    			}

    			if (dirty & /*note*/ 1) {
    				input1.checked = /*note*/ ctx[0].status;
    			}

    			if (dirty & /*formatedDate*/ 2) set_data_dev(t13, /*formatedDate*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let formatedDate;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Memo_preview', slots, []);
    	let { note = null } = $$props;
    	const dispatch = createEventDispatcher();

    	const updateNote = () => {
    		dispatch("updateNote", note);
    	};

    	const writable_props = ['note'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Memo_preview> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		note.name = this.value;
    		$$invalidate(0, note);
    	}

    	function textarea_input_handler() {
    		note.description = this.value;
    		$$invalidate(0, note);
    	}

    	function input1_change_handler() {
    		note.status = this.checked;
    		$$invalidate(0, note);
    	}

    	const click_handler = () => dispatch('closeView');

    	$$self.$$set = $$props => {
    		if ('note' in $$props) $$invalidate(0, note = $$props.note);
    	};

    	$$self.$capture_state = () => ({
    		dayjs: dayjs_min,
    		createEventDispatcher,
    		note,
    		dispatch,
    		updateNote,
    		formatedDate
    	});

    	$$self.$inject_state = $$props => {
    		if ('note' in $$props) $$invalidate(0, note = $$props.note);
    		if ('formatedDate' in $$props) $$invalidate(1, formatedDate = $$props.formatedDate);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*note*/ 1) {
    			$$invalidate(1, formatedDate = note && dayjs_min(note.updatedAt).format("DD.MM.YYYY, HH:mm"));
    		}
    	};

    	return [
    		note,
    		formatedDate,
    		dispatch,
    		updateNote,
    		input0_input_handler,
    		textarea_input_handler,
    		input1_change_handler,
    		click_handler
    	];
    }

    class Memo_preview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { note: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Memo_preview",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get note() {
    		throw new Error("<Memo_preview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set note(value) {
    		throw new Error("<Memo_preview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Note.svelte generated by Svelte v3.42.5 */
    const file$4 = "src/Components/Note.svelte";

    function create_fragment$4(ctx) {
    	let div5;
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let div1;
    	let t4_value = (/*description*/ ctx[1] || "") + "";
    	let t4;
    	let t5;
    	let div2;
    	let t6;
    	let div2_class_value;
    	let t7;
    	let div3;
    	let i0;
    	let t8;
    	let i0_class_value;
    	let t9;
    	let div4;
    	let i1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			t0 = text(/*orderNumber*/ ctx[2]);
    			t1 = text(".  ");
    			t2 = text(/*name*/ ctx[0]);
    			t3 = space();
    			div1 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div2 = element("div");
    			t6 = text(/*statusHru*/ ctx[5]);
    			t7 = space();
    			div3 = element("div");
    			i0 = element("i");
    			t8 = text("radio_button_unchecked");
    			t9 = space();
    			div4 = element("div");
    			i1 = element("i");
    			i1.textContent = "clear";
    			attr_dev(div0, "class", "header_cart svelte-1b8o77m");
    			add_location(div0, file$4, 1, 2, 30);
    			attr_dev(div1, "class", "hide-mobile svelte-1b8o77m");
    			add_location(div1, file$4, 2, 2, 105);
    			attr_dev(div2, "class", div2_class_value = "status hide-mobile " + (/*status*/ ctx[3] ? 'complete' : 'pending') + " svelte-1b8o77m");
    			add_location(div2, file$4, 3, 2, 158);
    			attr_dev(i0, "class", i0_class_value = "material-icons status " + (/*status*/ ctx[3] ? 'complete' : 'pending'));
    			add_location(i0, file$4, 7, 4, 283);
    			attr_dev(div3, "class", "hide-desktop svelte-1b8o77m");
    			add_location(div3, file$4, 6, 2, 252);
    			attr_dev(i1, "class", "material-icons memo-icons icon_close attention");
    			add_location(i1, file$4, 12, 4, 410);
    			attr_dev(div4, "class", "svelte-1b8o77m");
    			add_location(div4, file$4, 11, 2, 400);
    			attr_dev(div5, "class", "personal-cart svelte-1b8o77m");
    			add_location(div5, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div5, t3);
    			append_dev(div5, div1);
    			append_dev(div1, t4);
    			append_dev(div5, t5);
    			append_dev(div5, div2);
    			append_dev(div2, t6);
    			append_dev(div5, t7);
    			append_dev(div5, div3);
    			append_dev(div3, i0);
    			append_dev(i0, t8);
    			append_dev(div5, t9);
    			append_dev(div5, div4);
    			append_dev(div4, i1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", self$1(/*click_handler*/ ctx[7]), false, false, false),
    					listen_dev(
    						i1,
    						"click",
    						self$1(function () {
    							if (is_function(/*onDeleteItem*/ ctx[6](/*noteID*/ ctx[4]))) /*onDeleteItem*/ ctx[6](/*noteID*/ ctx[4]).apply(this, arguments);
    						}),
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*orderNumber*/ 4) set_data_dev(t0, /*orderNumber*/ ctx[2]);
    			if (dirty & /*name*/ 1) set_data_dev(t2, /*name*/ ctx[0]);
    			if (dirty & /*description*/ 2 && t4_value !== (t4_value = (/*description*/ ctx[1] || "") + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*statusHru*/ 32) set_data_dev(t6, /*statusHru*/ ctx[5]);

    			if (dirty & /*status*/ 8 && div2_class_value !== (div2_class_value = "status hide-mobile " + (/*status*/ ctx[3] ? 'complete' : 'pending') + " svelte-1b8o77m")) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (dirty & /*status*/ 8 && i0_class_value !== (i0_class_value = "material-icons status " + (/*status*/ ctx[3] ? 'complete' : 'pending'))) {
    				attr_dev(i0, "class", i0_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let statusHru;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Note', slots, []);
    	let { name = "" } = $$props;
    	let { description = "" } = $$props;
    	let { orderNumber = 0 } = $$props;
    	let { status = false } = $$props;
    	let { noteID = null } = $$props;
    	const dispatch = createEventDispatcher();

    	/** Methods **/
    	const onDeleteItem = id => {
    		dispatch("onNoteDelete", { id });
    	};

    	const writable_props = ['name', 'description', 'orderNumber', 'status', 'noteID'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Note> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('description' in $$props) $$invalidate(1, description = $$props.description);
    		if ('orderNumber' in $$props) $$invalidate(2, orderNumber = $$props.orderNumber);
    		if ('status' in $$props) $$invalidate(3, status = $$props.status);
    		if ('noteID' in $$props) $$invalidate(4, noteID = $$props.noteID);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		name,
    		description,
    		orderNumber,
    		status,
    		noteID,
    		dispatch,
    		onDeleteItem,
    		statusHru
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('description' in $$props) $$invalidate(1, description = $$props.description);
    		if ('orderNumber' in $$props) $$invalidate(2, orderNumber = $$props.orderNumber);
    		if ('status' in $$props) $$invalidate(3, status = $$props.status);
    		if ('noteID' in $$props) $$invalidate(4, noteID = $$props.noteID);
    		if ('statusHru' in $$props) $$invalidate(5, statusHru = $$props.statusHru);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*status*/ 8) {
    			$$invalidate(5, statusHru = status ? "Complete" : "Pending");
    		}
    	};

    	return [
    		name,
    		description,
    		orderNumber,
    		status,
    		noteID,
    		statusHru,
    		onDeleteItem,
    		click_handler
    	];
    }

    class Note extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			name: 0,
    			description: 1,
    			orderNumber: 2,
    			status: 3,
    			noteID: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Note",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get name() {
    		throw new Error("<Note>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Note>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<Note>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<Note>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get orderNumber() {
    		throw new Error("<Note>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set orderNumber(value) {
    		throw new Error("<Note>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get status() {
    		throw new Error("<Note>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set status(value) {
    		throw new Error("<Note>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noteID() {
    		throw new Error("<Note>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noteID(value) {
    		throw new Error("<Note>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/_common/confirm-modal.svelte generated by Svelte v3.42.5 */
    const file$3 = "src/Components/_common/confirm-modal.svelte";

    // (13:4) {#if hasControls}
    function create_if_block$1(ctx) {
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "No";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Yes";
    			attr_dev(button0, "class", "action-btn warn svelte-13thqbm");
    			add_location(button0, file$3, 14, 8, 301);
    			attr_dev(button1, "class", "action-btn success svelte-13thqbm");
    			add_location(button1, file$3, 15, 8, 376);
    			attr_dev(div, "class", "base_modal__controls svelte-13thqbm");
    			add_location(div, file$3, 13, 6, 258);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t1);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*closeAction*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*confirmAction*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(13:4) {#if hasControls}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let div0;
    	let h3;
    	let t0;
    	let h3_class_value;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let if_block = /*hasControls*/ ctx[2] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*message*/ ctx[1]);
    			t3 = space();
    			if (if_block) if_block.c();
    			attr_dev(h3, "class", h3_class_value = "" + (null_to_empty(`base_modal__title ${/*confirmType*/ ctx[3]}`) + " svelte-13thqbm"));
    			add_location(h3, file$3, 4, 4, 81);
    			attr_dev(p, "class", "base_modal__message centered-text svelte-13thqbm");
    			add_location(p, file$3, 8, 4, 158);
    			attr_dev(div0, "class", "base_modal__content");
    			add_location(div0, file$3, 2, 2, 42);
    			attr_dev(div1, "class", "base_modal confirm_modal");
    			add_location(div1, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(p, t2);
    			append_dev(div0, t3);
    			if (if_block) if_block.m(div0, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (dirty & /*confirmType*/ 8 && h3_class_value !== (h3_class_value = "" + (null_to_empty(`base_modal__title ${/*confirmType*/ ctx[3]}`) + " svelte-13thqbm"))) {
    				attr_dev(h3, "class", h3_class_value);
    			}

    			if (dirty & /*message*/ 2) set_data_dev(t2, /*message*/ ctx[1]);

    			if (/*hasControls*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Confirm_modal', slots, []);
    	let { title = '' } = $$props;
    	let { message = '' } = $$props;
    	let { hasControls = false } = $$props;
    	let { confirmType = 'normal' } = $$props;
    	const dispatch = createEventDispatcher();

    	const confirmAction = () => {
    		dispatch('confirmAction');
    	};

    	const closeAction = () => {
    		dispatch('closeModal');
    	};

    	const writable_props = ['title', 'message', 'hasControls', 'confirmType'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Confirm_modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    		if ('hasControls' in $$props) $$invalidate(2, hasControls = $$props.hasControls);
    		if ('confirmType' in $$props) $$invalidate(3, confirmType = $$props.confirmType);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		title,
    		message,
    		hasControls,
    		confirmType,
    		dispatch,
    		confirmAction,
    		closeAction
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    		if ('hasControls' in $$props) $$invalidate(2, hasControls = $$props.hasControls);
    		if ('confirmType' in $$props) $$invalidate(3, confirmType = $$props.confirmType);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, message, hasControls, confirmType, confirmAction, closeAction];
    }

    class Confirm_modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			title: 0,
    			message: 1,
    			hasControls: 2,
    			confirmType: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Confirm_modal",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get title() {
    		throw new Error("<Confirm_modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Confirm_modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<Confirm_modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<Confirm_modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasControls() {
    		throw new Error("<Confirm_modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasControls(value) {
    		throw new Error("<Confirm_modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get confirmType() {
    		throw new Error("<Confirm_modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set confirmType(value) {
    		throw new Error("<Confirm_modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/_common/Header.svelte generated by Svelte v3.42.5 */

    const file$2 = "src/Components/_common/Header.svelte";

    function create_fragment$2(ctx) {
    	let header;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div2;
    	let div1;
    	let strong;
    	let t2;
    	let span;
    	let t3_value = (/*apiStatus*/ ctx[0] && /*apiStatus*/ ctx[0].status) + "";
    	let t3;
    	let t4;
    	let t5_value = (/*apiStatus*/ ctx[0] && /*apiStatus*/ ctx[0].statusText) + "";
    	let t5;
    	let div1_class_value;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			strong = element("strong");
    			strong.textContent = "API status:";
    			t2 = space();
    			span = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			t5 = text(t5_value);
    			if (!src_url_equal(img.src, img_src_value = "img/logo.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "class", "svelte-1pko0qq");
    			add_location(img, file$2, 2, 4, 49);
    			attr_dev(div0, "class", "logo svelte-1pko0qq");
    			add_location(div0, file$2, 1, 2, 26);
    			add_location(strong, file$2, 6, 6, 238);
    			add_location(span, file$2, 7, 6, 274);

    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*apiStatus*/ ctx[0] && /*apiStatus*/ ctx[0].status > 300
    			? 'api_status error'
    			: 'api_status success') + " svelte-1pko0qq"));

    			add_location(div1, file$2, 5, 4, 138);
    			attr_dev(div2, "class", "api_status__container svelte-1pko0qq");
    			add_location(div2, file$2, 4, 2, 98);
    			attr_dev(header, "class", "header svelte-1pko0qq");
    			add_location(header, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div0);
    			append_dev(div0, img);
    			append_dev(header, t0);
    			append_dev(header, div2);
    			append_dev(div2, div1);
    			append_dev(div1, strong);
    			append_dev(div1, t2);
    			append_dev(div1, span);
    			append_dev(span, t3);
    			append_dev(span, t4);
    			append_dev(span, t5);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*apiStatus*/ 1 && t3_value !== (t3_value = (/*apiStatus*/ ctx[0] && /*apiStatus*/ ctx[0].status) + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*apiStatus*/ 1 && t5_value !== (t5_value = (/*apiStatus*/ ctx[0] && /*apiStatus*/ ctx[0].statusText) + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*apiStatus*/ 1 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*apiStatus*/ ctx[0] && /*apiStatus*/ ctx[0].status > 300
    			? 'api_status error'
    			: 'api_status success') + " svelte-1pko0qq"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let { apiStatus = null } = $$props;
    	const writable_props = ['apiStatus'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('apiStatus' in $$props) $$invalidate(0, apiStatus = $$props.apiStatus);
    	};

    	$$self.$capture_state = () => ({ apiStatus });

    	$$self.$inject_state = $$props => {
    		if ('apiStatus' in $$props) $$invalidate(0, apiStatus = $$props.apiStatus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [apiStatus];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { apiStatus: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get apiStatus() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set apiStatus(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/_common/searchBlock.svelte generated by Svelte v3.42.5 */
    const file$1 = "src/Components/_common/searchBlock.svelte";

    function create_fragment$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "custom-input search");
    			attr_dev(input, "placeholder", "Search by name");
    			add_location(input, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "keyup", /*keyup_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const debounceTime = 750;

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchBlock', slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	let timer = null;
    	const dispatch = createEventDispatcher();

    	const debounceValue = str => __awaiter(void 0, void 0, void 0, function* () {
    		clearTimeout(timer);

    		timer = setTimeout(
    			() => {
    				dispatch('searchQuery', str);
    			},
    			debounceTime
    		);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchBlock> was created with unknown prop '${key}'`);
    	});

    	const keyup_handler = ({ target: { value } }) => debounceValue(value);

    	$$self.$capture_state = () => ({
    		__awaiter,
    		createEventDispatcher,
    		timer,
    		debounceTime,
    		dispatch,
    		debounceValue
    	});

    	$$self.$inject_state = $$props => {
    		if ('__awaiter' in $$props) __awaiter = $$props.__awaiter;
    		if ('timer' in $$props) timer = $$props.timer;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [debounceValue, keyup_handler];
    }

    class SearchBlock extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { debounceValue: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchBlock",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get debounceValue() {
    		return this.$$.ctx[0];
    	}

    	set debounceValue(value) {
    		throw new Error("<SearchBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TemplateType;
    (function (TemplateType) {
        TemplateType["list"] = "list";
        TemplateType["apps"] = "apps";
    })(TemplateType || (TemplateType = {}));

    /* src/App.svelte generated by Svelte v3.42.5 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	child_ctx[23] = i;
    	return child_ctx;
    }

    // (40:19) 
    function create_if_block_3(ctx) {
    	let section;
    	let memopreview;
    	let section_transition;
    	let current;

    	memopreview = new Memo_preview({
    			props: { note: /*Memo*/ ctx[1] },
    			$$inline: true
    		});

    	memopreview.$on("updateNote", /*updateMemo*/ ctx[7]);
    	memopreview.$on("closeView", /*closePreview*/ ctx[8]);

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(memopreview.$$.fragment);
    			attr_dev(section, "class", "section_item view_item svelte-qwhla2");
    			add_location(section, file, 40, 6, 1247);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(memopreview, section, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const memopreview_changes = {};
    			if (dirty & /*Memo*/ 2) memopreview_changes.note = /*Memo*/ ctx[1];
    			memopreview.$set(memopreview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(memopreview.$$.fragment, local);

    			add_render_callback(() => {
    				if (!section_transition) section_transition = create_bidirectional_transition(
    					section,
    					slide,
    					{
    						delay: 200,
    						duration: 150,
    						easing: bounceInOut
    					},
    					true
    				);

    				section_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(memopreview.$$.fragment, local);

    			if (!section_transition) section_transition = create_bidirectional_transition(
    				section,
    				slide,
    				{
    					delay: 200,
    					duration: 150,
    					easing: bounceInOut
    				},
    				false
    			);

    			section_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(memopreview);
    			if (detaching && section_transition) section_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(40:19) ",
    		ctx
    	});

    	return block;
    }

    // (6:4) {#if !Memo}
    function create_if_block_2(ctx) {
    	let section;
    	let article;
    	let button;
    	let t1;
    	let div;
    	let i0;
    	let t3;
    	let i1;
    	let t5;
    	let searchblock;
    	let t6;
    	let section_transition;
    	let current;
    	let mounted;
    	let dispose;
    	searchblock = new SearchBlock({ $$inline: true });
    	searchblock.$on("searchQuery", /*searchNote*/ ctx[14]);
    	let each_value = /*Memos*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			article = element("article");
    			button = element("button");
    			button.textContent = "Add Memo";
    			t1 = space();
    			div = element("div");
    			i0 = element("i");
    			i0.textContent = "apps";
    			t3 = space();
    			i1 = element("i");
    			i1.textContent = "list";
    			t5 = space();
    			create_component(searchblock.$$.fragment);
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(button, "class", "action-btn mobile100 add_btn svelte-qwhla2");
    			add_location(button, file, 9, 10, 240);
    			attr_dev(i0, "class", "material-icons action-icon grid-icon hide-mobile svelte-qwhla2");
    			add_location(i0, file, 15, 12, 435);
    			attr_dev(i1, "class", "material-icons action-icon grid-icon hide-mobile svelte-qwhla2");
    			add_location(i1, file, 19, 12, 599);
    			attr_dev(div, "class", "flex-grid svelte-qwhla2");
    			add_location(div, file, 14, 10, 399);
    			add_location(article, file, 8, 8, 220);
    			attr_dev(section, "class", "section_item");
    			add_location(section, file, 6, 6, 127);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, article);
    			append_dev(article, button);
    			append_dev(article, t1);
    			append_dev(article, div);
    			append_dev(div, i0);
    			append_dev(div, t3);
    			append_dev(div, i1);
    			append_dev(div, t5);
    			mount_component(searchblock, div, null);
    			append_dev(article, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(article, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[16], false, false, false),
    					listen_dev(i0, "click", /*click_handler_1*/ ctx[17], false, false, false),
    					listen_dev(i1, "click", /*click_handler_2*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Memos, getOneMemoById, confirmDeleting*/ 6145) {
    				each_value = /*Memos*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(article, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchblock.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (!section_transition) section_transition = create_bidirectional_transition(section, fade, { delay: 50, duration: 150 }, true);
    				section_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchblock.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (!section_transition) section_transition = create_bidirectional_transition(section, fade, { delay: 50, duration: 150 }, false);
    			section_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(searchblock);
    			destroy_each(each_blocks, detaching);
    			if (detaching && section_transition) section_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(6:4) {#if !Memo}",
    		ctx
    	});

    	return block;
    }

    // (26:10) {#each Memos as note, i}
    function create_each_block(ctx) {
    	let note;
    	let current;

    	note = new Note({
    			props: {
    				name: /*note*/ ctx[21].name,
    				description: /*note*/ ctx[21].description,
    				orderNumber: /*i*/ ctx[23] + 1,
    				status: /*note*/ ctx[21].status,
    				noteID: /*note*/ ctx[21]._id
    			},
    			$$inline: true
    		});

    	note.$on("click", function () {
    		if (is_function(/*getOneMemoById*/ ctx[11](/*note*/ ctx[21]._id))) /*getOneMemoById*/ ctx[11](/*note*/ ctx[21]._id).apply(this, arguments);
    	});

    	note.$on("onNoteDelete", /*confirmDeleting*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(note.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(note, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const note_changes = {};
    			if (dirty & /*Memos*/ 1) note_changes.name = /*note*/ ctx[21].name;
    			if (dirty & /*Memos*/ 1) note_changes.description = /*note*/ ctx[21].description;
    			if (dirty & /*Memos*/ 1) note_changes.status = /*note*/ ctx[21].status;
    			if (dirty & /*Memos*/ 1) note_changes.noteID = /*note*/ ctx[21]._id;
    			note.$set(note_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(note.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(note.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(note, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(26:10) {#each Memos as note, i}",
    		ctx
    	});

    	return block;
    }

    // (50:2) {#if showAddModal}
    function create_if_block_1(ctx) {
    	let addmodal;
    	let current;
    	addmodal = new Add_modal({ $$inline: true });
    	addmodal.$on("addMemo", /*createNewMemo*/ ctx[6]);
    	addmodal.$on("closeModal", /*triggerModal*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(addmodal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(addmodal, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(addmodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(addmodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(addmodal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(50:2) {#if showAddModal}",
    		ctx
    	});

    	return block;
    }

    // (54:2) {#if confirmModal}
    function create_if_block(ctx) {
    	let confirmmodal;
    	let current;

    	confirmmodal = new Confirm_modal({
    			props: {
    				title: /*confirmModal*/ ctx[4].title,
    				message: /*confirmModal*/ ctx[4].message,
    				hasControls: /*confirmModal*/ ctx[4].controls,
    				confirmType: "warning"
    			},
    			$$inline: true
    		});

    	confirmmodal.$on("confirmAction", function () {
    		if (is_function(/*deleteMemo*/ ctx[13](/*confirmModal*/ ctx[4].data))) /*deleteMemo*/ ctx[13](/*confirmModal*/ ctx[4].data).apply(this, arguments);
    	});

    	confirmmodal.$on("closeModal", /*triggerConfirmModal*/ ctx[10]);

    	const block = {
    		c: function create() {
    			create_component(confirmmodal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(confirmmodal, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const confirmmodal_changes = {};
    			if (dirty & /*confirmModal*/ 16) confirmmodal_changes.title = /*confirmModal*/ ctx[4].title;
    			if (dirty & /*confirmModal*/ 16) confirmmodal_changes.message = /*confirmModal*/ ctx[4].message;
    			if (dirty & /*confirmModal*/ 16) confirmmodal_changes.hasControls = /*confirmModal*/ ctx[4].controls;
    			confirmmodal.$set(confirmmodal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(confirmmodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(confirmmodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(confirmmodal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(54:2) {#if confirmModal}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let header;
    	let t0;
    	let main;
    	let current_block_type_index;
    	let if_block0;
    	let main_class_value;
    	let t1;
    	let t2;
    	let t3;
    	let sveltetoast;
    	let current;

    	header = new Header({
    			props: { apiStatus: /*apiStatus*/ ctx[2] },
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*Memo*/ ctx[1]) return 0;
    		if (/*Memo*/ ctx[1]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	let if_block1 = /*showAddModal*/ ctx[3] && create_if_block_1(ctx);
    	let if_block2 = /*confirmModal*/ ctx[4] && create_if_block(ctx);
    	sveltetoast = new SvelteToast({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			create_component(sveltetoast.$$.fragment);
    			attr_dev(main, "class", main_class_value = "" + (null_to_empty(`main_area ${/*previewGrid*/ ctx[5]}`) + " svelte-qwhla2"));
    			add_location(main, file, 4, 2, 63);
    			attr_dev(div, "class", "memo-app");
    			add_location(div, file, 1, 0, 13);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(header, div, null);
    			append_dev(div, t0);
    			append_dev(div, main);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(main, null);
    			}

    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t2);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t3);
    			mount_component(sveltetoast, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const header_changes = {};
    			if (dirty & /*apiStatus*/ 4) header_changes.apiStatus = /*apiStatus*/ ctx[2];
    			header.$set(header_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block0) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block0 = if_blocks[current_block_type_index];

    					if (!if_block0) {
    						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block0.c();
    					} else {
    						if_block0.p(ctx, dirty);
    					}

    					transition_in(if_block0, 1);
    					if_block0.m(main, null);
    				} else {
    					if_block0 = null;
    				}
    			}

    			if (!current || dirty & /*previewGrid*/ 32 && main_class_value !== (main_class_value = "" + (null_to_empty(`main_area ${/*previewGrid*/ ctx[5]}`) + " svelte-qwhla2"))) {
    				attr_dev(main, "class", main_class_value);
    			}

    			if (/*showAddModal*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*showAddModal*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*confirmModal*/ ctx[4]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*confirmModal*/ 16) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, t3);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(sveltetoast.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(sveltetoast.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(header);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			destroy_component(sveltetoast);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	/* DATA  */
    	//@ts-ignore
    	let Memos = [];

    	let Memo = null;
    	let apiStatus = null;
    	let showAddModal = false;
    	let confirmModal = null;
    	let previewGrid = TemplateType.list;

    	/* END DATA  */
    	/* Methods */
    	const createNewMemo = memo => __awaiter(void 0, void 0, void 0, function* () {
    		const params = memo.detail.memoForm;
    		const resp = yield getApiResponse("memo", "POST", params, false);

    		if (resp && !(!!resp.errors || !!resp.error)) {
    			triggerConfirmModal(false);
    			showToast("Note has been added!", "successTheme");
    			yield getDefaultMemos(null);
    		} else {
    			const errorString = resp.error
    			? resp.error
    			: resp.errors.map(er => er.msg.concat());

    			showToast(`Note hasn't been added! resp.error ${errorString}`, "warningTheme");
    		}

    		triggerModal(false);
    	});

    	const updateMemo = e => __awaiter(void 0, void 0, void 0, function* () {
    		let { name, description, status } = e.detail;
    		let memoId = e.detail._id;
    		const resp = yield getApiResponse(`memo/${memoId}`, "PUT", { name, description, status }, false);

    		if (resp && !(!!resp.errors || !!resp.error)) {
    			showToast("Note has been Updated!", "successTheme");
    			$$invalidate(1, Memo = null);
    			yield getDefaultMemos(null);
    		} else {
    			const errorString = resp.error
    			? resp.error
    			: resp.errors.map(er => er.msg.concat());

    			showToast(`Note hasn't been updated! resp.error ${errorString}`, "warningTheme");
    		}
    	});

    	const closePreview = () => {
    		$$invalidate(1, Memo = null);
    	};

    	const triggerModal = status => {
    		$$invalidate(3, showAddModal = status ? status.detail : false);
    	};

    	const triggerConfirmModal = status => {
    		$$invalidate(4, confirmModal = status ? status.detail : false);
    	};

    	const getDefaultMemos = param => __awaiter(void 0, void 0, void 0, function* () {
    		const setUrl = param ? `memos?${param}` : "memos";
    		$$invalidate(0, Memos = yield getApiResponse(setUrl, "GET", null, false));
    	});

    	const getOneMemoById = id => __awaiter(void 0, void 0, void 0, function* () {
    		if (Memo && Memo._id === id) $$invalidate(1, Memo = null); else $$invalidate(1, Memo = yield getApiResponse(`memo/${id}`, "GET", null, false));
    	});

    	const confirmDeleting = e => {
    		$$invalidate(4, confirmModal = {
    			title: "Warning",
    			message: "You want to delete note?",
    			controls: true,
    			data: e
    		});
    	};

    	const deleteMemo = data => __awaiter(void 0, void 0, void 0, function* () {
    		const params = data.detail;
    		const resp = yield getApiResponse(`memo/${params.id}`, "DELETE", null, false);

    		if (resp) {
    			triggerConfirmModal(false);
    			showToast("Note has been deleted!", "successTheme");
    			yield getDefaultMemos(null);
    		} else showToast("Note hasn't been deleted!", "warningTheme");
    	});

    	const searchNote = e => __awaiter(void 0, void 0, void 0, function* () {
    		yield getDefaultMemos(`name=${e.detail}`);
    	});

    	const changeTemplate = e => __awaiter(void 0, void 0, void 0, function* () {
    		$$invalidate(5, previewGrid = e);
    	});

    	/* end Methods */
    	onMount(() => __awaiter(void 0, void 0, void 0, function* () {
    		yield getDefaultMemos(null);
    		$$invalidate(2, apiStatus = yield getApiResponse("status", "GET", null, true));
    		$$invalidate(0, Memos = yield getApiResponse("memos", "GET", null, false));
    	}));

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(3, showAddModal = true);
    	const click_handler_1 = () => changeTemplate("apps");
    	const click_handler_2 = () => changeTemplate("list");

    	$$self.$capture_state = () => ({
    		__awaiter,
    		slide,
    		fade,
    		bounceInOut,
    		SvelteToast,
    		onMount,
    		getApiResponse,
    		showToast,
    		AddModal: Add_modal,
    		MemoPreview: Memo_preview,
    		Note,
    		ConfirmModal: Confirm_modal,
    		Header,
    		SearchBlock,
    		TemplateType,
    		Memos,
    		Memo,
    		apiStatus,
    		showAddModal,
    		confirmModal,
    		previewGrid,
    		createNewMemo,
    		updateMemo,
    		closePreview,
    		triggerModal,
    		triggerConfirmModal,
    		getDefaultMemos,
    		getOneMemoById,
    		confirmDeleting,
    		deleteMemo,
    		searchNote,
    		changeTemplate
    	});

    	$$self.$inject_state = $$props => {
    		if ('__awaiter' in $$props) __awaiter = $$props.__awaiter;
    		if ('Memos' in $$props) $$invalidate(0, Memos = $$props.Memos);
    		if ('Memo' in $$props) $$invalidate(1, Memo = $$props.Memo);
    		if ('apiStatus' in $$props) $$invalidate(2, apiStatus = $$props.apiStatus);
    		if ('showAddModal' in $$props) $$invalidate(3, showAddModal = $$props.showAddModal);
    		if ('confirmModal' in $$props) $$invalidate(4, confirmModal = $$props.confirmModal);
    		if ('previewGrid' in $$props) $$invalidate(5, previewGrid = $$props.previewGrid);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		Memos,
    		Memo,
    		apiStatus,
    		showAddModal,
    		confirmModal,
    		previewGrid,
    		createNewMemo,
    		updateMemo,
    		closePreview,
    		triggerModal,
    		triggerConfirmModal,
    		getOneMemoById,
    		confirmDeleting,
    		deleteMemo,
    		searchNote,
    		changeTemplate,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
